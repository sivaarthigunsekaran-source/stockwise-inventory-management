import { API_BASE_URL, ENDPOINTS } from '../config';

/* -------------------------------------------------------
   Generic API request
------------------------------------------------------- */

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;

    try {
      const body = await response.json();
      message = body.message || body.error || message;
    } catch {
      // Response is not JSON
    }

    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();

  return text ? JSON.parse(text) : null;
}

/* -------------------------------------------------------
   Helpers
------------------------------------------------------- */

function toArray(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (data && Array.isArray(data.content)) {
    return data.content;
  }

  return [];
}

function pick(object, keys, fallback = null) {
  for (const key of keys) {
    if (
      object &&
      object[key] !== undefined &&
      object[key] !== null
    ) {
      return object[key];
    }
  }

  return fallback;
}

function parseDate(value) {
  if (!value) {
    return null;
  }

  // Spring Boot LocalDateTime can sometimes be returned
  // as [year, month, day, hour, minute, second]
  if (Array.isArray(value)) {
    const [
      year,
      month = 1,
      day = 1,
      hour = 0,
      minute = 0,
      second = 0,
    ] = value;

    return new Date(
      year,
      month - 1,
      day,
      hour,
      minute,
      second
    );
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? null
    : date;
}

/* -------------------------------------------------------
   Product normalization
------------------------------------------------------- */

function normalizeProduct(product) {
  const stockKey =
    product.currentStock !== undefined
      ? 'currentStock'
      : product.quantity !== undefined
        ? 'quantity'
        : product.stock !== undefined
          ? 'stock'
          : 'currentStock';

  return {
    id: pick(product, ['id', 'productId']),

    name: String(
      pick(
        product,
        ['name', 'productName'],
        'Unnamed product'
      )
    ),

    sku: String(
      pick(
        product,
        ['sku', 'SKU', 'skuCode'],
        '—'
      )
    ),

    unitCost: Number(
      pick(
        product,
        ['unitCost', 'unit_cost', 'cost', 'price'],
        0
      )
    ),

    currentStock: Number(
      pick(
        product,
        ['currentStock', 'current_stock', 'quantity', 'stock'],
        0
      )
    ),

    reorderLevel: Number(
      pick(
        product,
        [
          'reorderLevel',
          'reorder_level',
          'reorderPoint',
        ],
        0
      )
    ),

    stockKey,

    // Keep the original backend object
    raw: product,
  };
}

/* -------------------------------------------------------
   Transaction normalization
------------------------------------------------------- */

function normalizeTransaction(transaction, products) {
  const productId = pick(
    transaction,
    ['productId', 'product_id'],
    transaction?.product?.id
  );

  const matchedProduct = products.find(
    (product) =>
      String(product.id) === String(productId)
  );

  const rawType = String(
    pick(
      transaction,
      [
        'type',
        'transactionType',
        'action',
      ],
      'IN'
    )
  ).toUpperCase();

  const quantity = Number(
    pick(
      transaction,
      [
        'quantity',
        'qty',
        'amount',
      ],
      0
    )
  );

  const isOut =
    ['OUT', 'REDUCE', 'REMOVE', 'SALE', 'ISSUE'].some(
      (word) => rawType.includes(word)
    ) || quantity < 0;

  const date = parseDate(
    pick(
      transaction,
      [
        'createdAt',
        'timestamp',
        'transactionDate',
        'date',
        'createdDate',
      ]
    )
  );

  return {
    id: pick(
      transaction,
      ['id', 'transactionId'],
      `${productId}-${date}`
    ),

    productName: pick(
      transaction,
      ['productName'],
      transaction?.product?.name ||
        matchedProduct?.name ||
        'Unknown product'
    ),

    type: isOut ? 'OUT' : 'IN',

    quantity: Math.abs(quantity),

    date,

    note: String(
      pick(
        transaction,
        [
          'note',
          'remarks',
          'reason',
          'description',
        ],
        ''
      )
    ),
  };
}

/* -------------------------------------------------------
   Product payload
------------------------------------------------------- */

function buildProductPayload(form) {
  return {
    name: form.name.trim(),
    sku: form.sku.trim(),
    unitCost: Number(form.unitCost),
    currentStock: Number(form.currentStock),
    reorderLevel: Number(form.reorderLevel),
  };
}

/* -------------------------------------------------------
   GET PRODUCTS
------------------------------------------------------- */

export async function getProducts() {
  const data = await request(
    ENDPOINTS.products
  );

  return toArray(data).map(
    normalizeProduct
  );
}

/* -------------------------------------------------------
   CREATE PRODUCT
------------------------------------------------------- */

export async function createProduct(form) {
  return request(
    ENDPOINTS.products,
    {
      method: 'POST',

      body: JSON.stringify(
        buildProductPayload(form)
      ),
    }
  );
}

/* -------------------------------------------------------
   CHANGE STOCK
------------------------------------------------------- */

export async function changeStock(
  product,
  type,
  quantity
) {
  const amount = Number(quantity);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error(
      'Quantity must be greater than 0.'
    );
  }

  const endpoint =
    type === 'IN'
      ? ENDPOINTS.addStock
      : ENDPOINTS.reduceStock;

  /*
    First try the dedicated stock endpoint.
  */

  try {
    return await request(
      endpoint(product.id),
      {
        method: 'POST',

        body: JSON.stringify({
          quantity: amount,
        }),
      }
    );
  } catch (error) {
    /*
      If the backend does not provide the
      dedicated endpoint, fall back to PUT.
    */

    if (
      error.status !== 404 &&
      error.status !== 405
    ) {
      throw error;
    }
  }

  /*
    Fallback:
    update the product directly.
  */

  const currentStock = Number(
    product.currentStock || 0
  );

  const newStock =
    type === 'IN'
      ? currentStock + amount
      : currentStock - amount;

  if (newStock < 0) {
    throw new Error(
      'Stock cannot be less than zero.'
    );
  }

  const payload = {
    ...product.raw,
    [product.stockKey || 'currentStock']:
      newStock,
  };

  return request(
    `${ENDPOINTS.products}/${product.id}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    }
  );
}

/* -------------------------------------------------------
   GET TRANSACTIONS
------------------------------------------------------- */

export async function getTransactions(
  products = []
) {
  const data = await request(
    ENDPOINTS.transactions
  );

  return toArray(data)
    .map((transaction) =>
      normalizeTransaction(
        transaction,
        products
      )
    )
    .sort(
      (a, b) =>
        (b.date?.getTime() || 0) -
        (a.date?.getTime() || 0)
    );
}