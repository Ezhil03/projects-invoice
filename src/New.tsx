import React, { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

function App() {
  const [client, setClient] = useState<Client>({
    name: "",
    address: "",
    invoiceNumber: "INV-001",
    date: new Date().toISOString().split("T")[0],
  });

  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState<Omit<Item, "amount">>({
    description: "",
    quantity: 1,
    rate: 0,
  });

  // Handle client info
  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClient({ ...client, [e.target.name]: e.target.value });
  };

  // Handle item input
  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem({
      ...newItem,
      [name]: name === "quantity" || name === "rate" ? Number(value) : value,
    });
  };

  // Add item
  const addItem = () => {
    if (!newItem.description) return;
    const amount = newItem.quantity * newItem.rate;
    setItems([...items, { ...newItem, amount }]);
    setNewItem({ description: "", quantity: 1, rate: 0 });
  };

  // Delete item
  const deleteItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Edit item
  const editItem = (index: number, field: keyof Item, value: string | number) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === "quantity" || field === "rate" ? Number(value) : value,
    };
    updatedItems[index].amount =
      updatedItems[index].quantity * updatedItems[index].rate;
    setItems(updatedItems);
  };

  // Totals
  const subtotal = items.reduce((acc, item) => acc + item.amount, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  // ✅ Corrected Export PDF
  const exportPDF = () => {
    const input = document.getElementById("invoice");
    if (!input) return;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const pdf = new jsPDF("p", "mm", "a4");
      const imgData = canvas.toDataURL("image/png");

      const imgWidth = 190; // width in mm
      const pageHeight = pdf.internal.pageSize.height; // height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, "PNG", 10, position + 10, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Extra pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position + 10, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${client.invoiceNumber}.pdf`);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Invoice Builder</h1>

        {/* Client Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            name="name"
            placeholder="Client Name"
            value={client.name}
            onChange={handleClientChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="address"
            placeholder="Client Address"
            value={client.address}
            onChange={handleClientChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="invoiceNumber"
            placeholder="Invoice Number"
            value={client.invoiceNumber}
            onChange={handleClientChange}
            className="border p-2 rounded"
          />
          <input
            type="date"
            name="date"
            value={client.date}
            onChange={handleClientChange}
            className="border p-2 rounded"
          />
        </div>

        {/* Add Item */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={newItem.description}
            onChange={handleItemChange}
            className="border p-2 rounded flex-1"
          />
          <input
            type="number"
            name="quantity"
            placeholder="Qty"
            value={newItem.quantity}
            onChange={handleItemChange}
            className="border p-2 rounded w-20"
          />
          <input
            type="number"
            name="rate"
            placeholder="Rate"
            value={newItem.rate}
            onChange={handleItemChange}
            className="border p-2 rounded w-24"
          />
          <button
            onClick={addItem}
            className="bg-blue-500 text-white px-4 rounded"
          >
            Add
          </button>
        </div>

        {/* Invoice Preview */}
        <div id="invoice" className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Invoice</h2>
          <p><strong>Client:</strong> {client.name}</p>
          <p><strong>Address:</strong> {client.address}</p>
          <p><strong>Invoice #:</strong> {client.invoiceNumber}</p>
          <p><strong>Date:</strong> {client.date}</p>

          <table className="w-full mt-4 border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Description</th>
                <th className="border p-2">Qty</th>
                <th className="border p-2">Rate</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        editItem(i, "description", e.target.value)
                      }
                      className="w-full border rounded p-1"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        editItem(i, "quantity", Number(e.target.value))
                      }
                      className="w-full border rounded p-1"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) =>
                        editItem(i, "rate", Number(e.target.value))
                      }
                      className="w-full border rounded p-1"
                    />
                  </td>
                  <td className="border p-2">{item.amount.toFixed(2)}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => deleteItem(i)}
                      className="bg-red-500 text-white px-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="mt-4 text-right">
            <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
            <p>Tax (10%): ₹{tax.toFixed(2)}</p>
            <p className="font-bold">Total: ₹{total.toFixed(2)}</p>
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={exportPDF}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded"
        >
          Export as PDF
        </button>
      </div>
    </div>
  );
}

export default App;
