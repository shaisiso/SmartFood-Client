import React from "react";

const ReadOnlyRow = ({ item, handleEditClick, handleDeleteClick }) => {
  return (
    <tr>
      <td>{item.name}</td>
      <td>{item.category}</td>
      <td>{item.description}</td>
      <td>{item.price}</td>
      <td>
        <button
          type="button"
          className="form-control btn btn-info mx-auto"
          onClick={(event) => handleEditClick(event, item)}
        >
          Edit
        </button>
        <button type="button" className="form-control btn btn-danger mt-1 mx-auto" onClick={() => handleDeleteClick(item)}>
          Delete
        </button>
      </td>
    </tr>
  );
};

export default ReadOnlyRow;