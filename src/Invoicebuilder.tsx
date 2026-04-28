import React, { useState } from "react";
interface Client {
  name: string;
  address: string;
  invoiceNumber: string;
  date: string;
}

interface Item {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

function Sample() {
  const [client, setClient] = useState<Client>({
    name: "",
    address: "",
    invoiceNumber: "INVOICE NUMBER-001",
    date: new Date().toISOString().split("T")[0],
  });

  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState<Omit<Item, "amount">>({
    description: "",
    quantity: 1,
    rate: 0,
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClient({ ...client, [e.target.name]: e.target.value });
  };

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem({
      ...newItem,
      [name]: name === "quantity" || name === "rate" ? Number(value) : value,
    });
  };

  const addOrUpdateItem = () => {
    if (!client.name.trim() || !client.address.trim()) {
      alert("Client name and address are required before adding items.");
      return;
    }
    if (!newItem.description.trim()) {
      alert("Description is required");
      return;
    }
    if (newItem.quantity <= 0 || newItem.rate <= 0) {
      alert("Quantity and Rate must be positive numbers");
      return;
    }
    const amount = newItem.quantity * newItem.rate;
    if (editIndex !== null) {
      const updatedItems = [...items];
      updatedItems[editIndex] = { ...newItem, amount };
      setItems(updatedItems);
      setEditIndex(null);
    } else {
      setItems([...items, { ...newItem, amount }]);
    }
    setNewItem({ description: "", quantity: 1, rate: 0 });
  };
  const editItem = (index: number) => {
    const item = items[index];
    setNewItem({
      description: item.description,
      quantity: item.quantity,
      rate: item.rate,
    });
    setEditIndex(index);
  };
  const deleteItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };
  const subtotal = items.reduce((acc, item) => acc + item.amount, 0);
  const taxRate = 0.1; // 10% tax
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  const printInvoice = () => {
    if (!client.name.trim() || !client.address.trim()) {
      alert("Please fill in client name and address before printing.");
      return;
    }
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Invoice Builder</h1>
           <p className="text-gray-600">
            A simple React application to create, edit, and print invoices with
            client details, line items, and automatic tax calculation.
          </p>
          
       </div>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <label>
            Client Name :
            <input
              type="text"
              name="name"
              value={client.name}
              onChange={handleClientChange}
              required
              className="border p-2 rounded w-full"
            />
          </label>
          <label>
            Client Address :
            <input
              type="text"
              name="address"
              value={client.address}
              onChange={handleClientChange}
              required
              className="border p-2 rounded w-full"
            />
          </label>
          <label>
            Invoice Number :
            <input
              type="text"
              name="invoiceNumber"
              value={client.invoiceNumber}
              onChange={handleClientChange}
              required
              className="border p-2 rounded w-full"
            />
          </label>
          <label>
            Date :
            <input
              type="date"
              name="date"
              value={client.date}
              onChange={handleClientChange}
              required
              className="border p-2 rounded w-full"
            />
          </label>
        </form>
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <label className="flex-1 min-w-[200px]">
            Description :
            <input
              type="text"
              name="description"
              value={newItem.description}
              onChange={handleItemChange}
              className="border p-2 rounded w-full"
              required
            />
          </label>
          <label>
            Quantity:
            <input
              type="number"
              name="quantity"
              value={newItem.quantity}
              onChange={handleItemChange}
              className="border p-2 rounded w-24 text-right"
              required
              min={1}
            />
          </label>
          <label>
            Rate:
            <input
              type="number"
              name="rate"
              value={newItem.rate}
              onChange={handleItemChange}
              className="border p-2 rounded w-32 text-right"
              required
              min={1}
            />
          </label>
          <button
            onClick={addOrUpdateItem}
            className="bg-blue-500 text-white px-6 py-2 rounded"
          >
            {editIndex !== null ? "Update" : "Add"}
          </button>
        </div>
        <div id="invoice" className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Invoice</h2>
          <p><strong>Client:</strong> {client.name}</p>
          <p><strong>Address:</strong> {client.address}</p>
          <p><strong>Invoice #:</strong> {client.invoiceNumber}</p>
          <p><strong>Date:</strong> {client.date}</p>

          <table className="w-full mt-4 border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2 text-left">Description</th>
                <th className="border p-2 text-right">Qty</th>
                <th className="border p-2 text-right">Rate</th>
                <th className="border p-2 text-right">Amount</th>
                <th className="border p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td className="border p-2 text-left">{item.description}</td>
                  <td className="border p-2 text-right">{item.quantity}</td>
                  <td className="border p-2 text-right">₹{item.rate.toFixed(2)}</td>
                  <td className="border p-2 text-right">₹{item.amount.toFixed(2)}</td>
                  <td className="border p-2 text-center space-x-2">
                    <button
                      onClick={() => editItem(i)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteItem(i)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex justify-end">
            <div className="text-right">
              <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
              <p>Tax (10%): ₹{tax.toFixed(2)}</p>
              <p className="font-bold">Total: ₹{total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <button
          onClick={printInvoice}
          className="mt-6 bg-purple-600 text-white px-6 py-2 rounded"
        >
          Print Invoice
        </button>
      </div>
    </div>
  );
}

export default Sample;