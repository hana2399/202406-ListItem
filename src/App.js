import React, { useState } from "react";
import { read, utils, writeFile } from "xlsx";
import "./App.css"; // 確保引入了 Tailwind CSS

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    Category: "",
    Name: "",
    Capacity: "1",
    Price: "",
    PurchaseDate: "",
    OpenDate: "",
    Notes: "",
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleSave = () => {
    // 日期驗證
    const purchaseDate = new Date(newItem.PurchaseDate);
    const openDate = new Date(newItem.OpenDate);
    const today = new Date();
    if (openDate < purchaseDate) {
      alert("Please confirm the date!!!!");
      return;
    }

    if ((today - purchaseDate) / (1000 * 60 * 60 * 24 * 365) > 2) {
      newItem.PurchaseDateStyle = "text-red-500";
    } else {
      newItem.PurchaseDateStyle = "";
    }

    if ((today - openDate) / (1000 * 60 * 60 * 24 * 365) > 2) {
      newItem.OpenDateStyle = "text-red-500";
    } else {
      newItem.OpenDateStyle = "";
    }
    setItems([...items, newItem]);
    setShowAddModal(false);
    setNewItem({
      Category: "",
      Name: "",
      Capacity: "1",
      Price: "",
      PurchaseDate: "",
      OpenDate: "",
      Notes: "",
    });
  };

  const handleEditSave = () => {
    const updatedItems = [...items];
    updatedItems[editIndex] = editItem;

    setItems(updatedItems);
    setEditIndex(null);
    setEditItem(null);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const importedItems = utils.sheet_to_json(sheet);
      setItems(importedItems);
    };
    reader.readAsBinaryString(file);
  };

  const handleExport = () => {
    const worksheet = utils.json_to_sheet(items);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Sheet1");
    writeFile(workbook, "items.xlsx");
  };

  const handleEditItem = (index) => {
    setEditIndex(index);
    setEditItem(items[index]);
  };

  const handleDeleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">簡單清單表</h1>
      {/* <table className="min-w-98 bg-white shadow-md rounded-lg my-3 border-gray-50 items-center mx-px">
        <input type="file" onChange={handleImport} />
        <button
          onClick={handleAddClick}
          className="ml-2 p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
        >
          +
        </button>
        <button
          onClick={handleExport}
          className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          匯出 Excel
        </button>
      </table> */}
      <div className="w-3/5 fixed bottom-4 right-4 bg-[#dce0e3] bg-opacity-90 shadow-md rounded-lg my-0 mx-1 flex flex-row items-center space-y-2">
        <div className="flex justify-center items-center w-full">
          <input type="file" onChange={handleImport} className="mb-2" />
        </div>
        <div className="flex justify-center items-center w-full">
          <button
            onClick={handleAddClick}
            className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
          >
            +
          </button>
        </div>
        <div className="flex justify-center items-center w-full">
          <button
            onClick={handleExport}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            匯出 Excel
          </button>
        </div>
      </div>

      <table className="min-w-95 bg-white shadow-md rounded-lg my-12 border-gray-50 my-px">
        <thead className="bg-[#8da5b3] text-[#fff] border-gray-50 rounded-lg">
          <tr className="border-gray-50 rounded-lg">
            <th className="py-2 px-3 border-gray-50">Category</th>
            <th className="py-2 px-3 border-gray-50">Name</th>
            <th className="py-2 px-3 border-gray-50">Capacity</th>
            <th className="py-2 px-3 border-gray-50">Price</th>
            <th className="py-2 px-3 border-gray-50">PurchaseDate</th>
            <th className="py-2 px-3 border-gray-50">OpenDate</th>
            <th className="py-2 px-3 border-gray-50">Notes</th>
            <th className="py-2 px-4 border-gray-50">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr
              key={index}
              className="hover:bg-gray-100 cursor-pointer border-gray-50"
              onClick={() => {
                setSelectedItem(item);
                setEditItem(true);
                handleEditItem(index);
              }}
            >
              <td className="py-2 px-3 border-gray-50">{item.Category}</td>
              <td className="py-2 px-3 border-gray-50">{item.Name}</td>
              <td className="py-2 px-4 text-center border-gray-50">
                {item.Capacity}
              </td>
              <td className="py-2 px-4 text-center border-gray-50">
                {item.Price}
              </td>
              <td
                className={`py-2 text-center border-gray-50 ${item.PurchaseDateStyle}`}
              >
                {item.PurchaseDate}
              </td>
              <td
                className={`py-2 text-center border-gray-50 ${item.OpenDateStyle}`}
              >
                {item.OpenDate}
              </td>
              <td className="py-2 px-3 border-gray-50">{item.Notes}</td>
              <td className="py-2 px-4 flex border-gray-50 items-center justify-center">
                {/* <button
                  onClick={() => handleEditItem(index)}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-3 rounded mr-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </button> */}
                <button
                  onClick={() => handleDeleteItem(index)}
                  className="red-700 hover:red-900 text-white round-full py-1 px-3 rounded"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 red-700 hover:red-900 "
                  >
                    <path
                      className="red-700 hover:red-900 "
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showAddModal && (
        <div className="fixed min-w-90 inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-semibold mb-4">新增項目</h2>
            <input
              type="text"
              placeholder="Category"
              value={newItem.Category}
              onChange={(e) =>
                setNewItem({ ...newItem, Category: e.target.value })
              }
              className="mb-3 p-2 border rounded w-full"
            />
            <input
              type="text"
              placeholder="Name"
              value={newItem.Name}
              onChange={(e) => setNewItem({ ...newItem, Name: e.target.value })}
              className="mb-3 p-2 border rounded w-full"
            />
            <select
              value={newItem.Capacity}
              onChange={(e) =>
                setNewItem({ ...newItem, Capacity: e.target.value })
              }
              className="mb-3 p-2 border rounded w-full"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
            <input
              type="text"
              placeholder="Price"
              value={newItem.Price}
              onChange={(e) =>
                setNewItem({ ...newItem, Price: e.target.value })
              }
              className="mb-3 p-2 border rounded w-full"
            />
            <input
              type="date"
              placeholder="PurchaseDate"
              value={newItem.PurchaseDate}
              onChange={(e) =>
                setNewItem({ ...newItem, PurchaseDate: e.target.value })
              }
              className="mb-3 p-2 border rounded w-full"
            />
            <input
              type="date"
              placeholder="OpenDate"
              value={newItem.OpenDate}
              onChange={(e) =>
                setNewItem({ ...newItem, OpenDate: e.target.value })
              }
              className="mb-3 p-2 border rounded w-full"
            />
            <input
              type="text"
              placeholder="Notes"
              value={newItem.Notes}
              onChange={(e) =>
                setNewItem({ ...newItem, Notes: e.target.value })
              }
              className="mb-3 p-2 border rounded w-full"
            />
            <div className="flex justify-end">
              <button
                // onClick={handleSave}
                onClick={() => {
                  handleSave();
                  window.scrollTo({
                    top: document.documentElement.scrollHeight,
                    behavior: "smooth",
                  });
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                保存
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {editIndex !== null && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-semibold mb-4">編輯項目</h2>
            <input
              type="text"
              placeholder="Category"
              value={editItem.Category}
              onChange={(e) =>
                setEditItem({ ...editItem, Category: e.target.value })
              }
              className="mb-3 p-2 border rounded w-full"
            />
            <input
              type="text"
              placeholder="Name"
              value={editItem.Name}
              onChange={(e) =>
                setEditItem({ ...editItem, Name: e.target.value })
              }
              className="mb-3 p-2 border rounded w-full"
            />
            <select
              value={editItem.Capacity}
              onChange={(e) =>
                setEditItem({ ...editItem, Capacity: e.target.value })
              }
              className="mb-3 p-2 border rounded w-full"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
            <input
              type="text"
              placeholder="Price"
              value={editItem.Price}
              onChange={(e) =>
                setEditItem({ ...editItem, Price: e.target.value })
              }
              className="mb-3 p-2 border rounded w-full"
            />
            <input
              type="date"
              placeholder="PurchaseDate"
              value={editItem.PurchaseDate}
              onChange={(e) =>
                setEditItem({ ...editItem, PurchaseDate: e.target.value })
              }
              className="mb-3 p-2 border rounded w-full"
            />
            <input
              type="date"
              placeholder="OpenDate"
              value={editItem.OpenDate}
              onChange={(e) =>
                setEditItem({ ...editItem, OpenDate: e.target.value })
              }
              className="mb-3 p-2 border rounded w-full"
            />
            <input
              type="text"
              placeholder="Notes"
              value={editItem.Notes}
              onChange={(e) =>
                setEditItem({ ...editItem, Notes: e.target.value })
              }
              className="mb-3 p-2 border rounded w-full"
            />
            <div className="flex justify-end">
              <button
                onClick={handleEditSave}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                保存
              </button>
              <button
                onClick={() => setEditIndex(null)}
                className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
