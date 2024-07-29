import React, { useState } from "react";
import { read, utils, writeFile } from "xlsx";
import { saveAs } from "file-saver";
import { Modal, Button } from "react-bootstrap";
import "tailwindcss/tailwind.css";
import "bootstrap/dist/css/bootstrap.min.css";

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    Category: "",
    Name: "",
    Capacity: "",
    Price: "",
    PurchaseDate: "",
    OpenDate: "",
    Notes: "",
  });
  const [showNewItemInput, setShowNewItemInput] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setNewItem({
      ...newItem,
      [e.target.name]: e.target.value,
    });
  };

  const handleShowModal = (isEditing) => {
    setIsEditing(isEditing);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAddItem = () => {
    setNewItem({
      Category: '',
      Name: '',
      Capacity: '',
      Price: '',
      PurchaseDate: '',
      OpenDate: '',
      Notes: ''
    });
    handleShowModal(false);
  };

  const handleEditItem = (index) => {
    setNewItem(items[index]);
    setEditIndex(index);
    handleShowModal(true);
  };

  const handleUpdateItem = () => {
    const updatedItems = items.map((item, index) =>
      index === editIndex ? newItem : item
    );
    setItems(updatedItems);
    setNewItem({
      Category: "",
      Name: "",
      Capacity: "",
      Price: "",
      PurchaseDate: "",
      OpenDate: "",
      Notes: "",
    });
    setEditIndex(null);
    setShowNewItemInput(false);
  };

  const handleDeleteItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = utils.sheet_to_json(worksheet);
      setItems(json);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleExport = () => {
    const worksheet = utils.json_to_sheet(items);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
    const excelBuffer = writeFile(workbook, "ItemList.xlsx", {
      bookType: "xlsx",
      type: "array",
    });
    saveAs(
      new Blob([excelBuffer], { type: "application/octet-stream" }),
      "ItemList.xlsx"
    );
  };

  const isOldDate = (date) => {
    const currentDate = new Date();
    const inputDate = new Date(date);
    return (currentDate - inputDate) / (1000 * 3600 * 24) > 365 * 2;
  };

  return (
    <div className="container my-4">
      <h1 className="mb-4">ItemList</h1>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <input
          type="file"
          onChange={handleImport}
          className="form-control mb-2 mb-md-0"
        />
        <button
          onClick={handleExport}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Export to Excel
        </button>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th className="py-2 px-4">Category</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Capacity</th>
              <th className="py-2 px-4">Price</th>
              <th className="py-2 px-4">PurchaseDate</th>
              <th className="py-2 px-4">OpenDate</th>
              <th className="py-2 px-4">Notes</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="py-2 px-4">{item.Category}</td>
                <td className="py-2 px-4">{item.Name}</td>
                <td className="py-2 px-4">{item.Capacity}</td>
                <td className="py-2 px-4">{item.Price}</td>
                <td
                  className={`py-2 px-4${
                    isOldDate(item.PurchaseDate) ? "text-red-700" : ""
                  }`}
                >
                  {item.PurchaseDate}
                </td>
                <td
                  className={`py-2 px-4${
                    isOldDate(item.OpenDate) ? "text-red-700" : ""
                  }`}
                >
                  {item.OpenDate}
                </td>
                <td className="py-2 px-4">{item.Notes}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleEditItem(index)}
                    className="bg-yellow-500 text-white py-1 px-3 rounded mr-2"
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
                  </button>
                  <button
                    onClick={() => handleDeleteItem(index)}
                    className="bg-red-700 text-white py-1 px-3 rounded"
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
                        d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={handleAddItem} className="btn btn-primary btn-lg rounded-circle fixed-bottom m-4">+</button>

      <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? 'EditItem' : 'AddItem'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column flex-md-row flex-wrap">
          <select name="Category" value={newItem.Category} onChange={handleChange} className="form-select mb-2 mb-md-0 me-md-2">
            <option value="">選擇分類</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
          <input type="text" name="Name" placeholder="Name" value={newItem.Name} onChange={handleChange} className="form-control mb-2 mb-md-0 me-md-2" />
          <input type="text" name="Capacity" placeholder="Capacity" value={newItem.Capacity} onChange={handleChange} className="form-control mb-2 mb-md-0 me-md-2" />
          <input type="text" name="Price" placeholder="價格" value={newItem.Price} onChange={handleChange} className="form-control mb-2 mb-md-0 me-md-2" />
          <input type="date" name="PurchaseDate" placeholder="購買日期" value={newItem.PurchaseDate} onChange={handleChange} className="form-control mb-2 mb-md-0 me-md-2" />
          <input type="date" name="OpenDate" placeholder="開封日期" value={newItem.OpenDate} onChange={handleChange} className="form-control mb-2 mb-md-0 me-md-2" />
          <input type="text" name="Notes" placeholder="備註" value={newItem.Notes} onChange={handleChange} className="form-control mb-2 mb-md-0 me-md-2" />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          取消
        </Button>
        <Button variant="primary" onClick={editIndex !== null ? handleUpdateItem : handleAddItem}>
          {editIndex !== null ? '更新項目' : '新增項目'}
        </Button>
      </Modal.Footer>
    </Modal>
    </div>
  );
};

export default ItemList;
