const form = document.getElementById('item-form');
const itemsContainer = document.getElementById('items');
const refreshBtn = document.getElementById('refresh-btn');

async function fetchItems() {
  const response = await fetch('/api/v1/items');
  const payload = await response.json();

  const rows = payload.data || [];
  if (!rows.length) {
    itemsContainer.innerHTML = '<p>No items yet.</p>';
    return;
  }

  itemsContainer.innerHTML = rows
    .map(
      (item) => `
      <article class="item-row">
        <div>
          <strong>${item.name}</strong> (${item.sku})<br />
          <small>${item.description || ''}</small>
        </div>
        <div>
          Qty: ${item.quantity}<br />
          Price: $${Number(item.unit_price).toFixed(2)}
        </div>
      </article>
    `
    )
    .join('');
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(form);

  const payload = {
    sku: formData.get('sku'),
    name: formData.get('name'),
    description: formData.get('description'),
    quantity: Number(formData.get('quantity')),
    unit_price: Number(formData.get('unit_price'))
  };

  const response = await fetch('/api/v1/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorPayload = await response.json();
    alert(errorPayload.error || 'Failed to create item');
    return;
  }

  form.reset();
  fetchItems();
});

refreshBtn.addEventListener('click', fetchItems);

fetchItems();
