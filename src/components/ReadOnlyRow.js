import React from "react";

const ReadOnlyRow = ({ item, withId, handleEditClick, handleDeleteClick }) => {
  return (
    <tr>
      {
        Object.values(item).map((property, key) =>
          key > 0 || withId ?
            <td key={key} className="align-middle">{property}</td>
            :
            null
        )}
      <td>
        <button
          type="button"
          className="form-control btn btn-info  btn-sm mx-auto"
          onClick={(event) => handleEditClick(event, item)}
        >
          Edit
        </button>
        <button type="button" className="form-control btn btn-danger btn-sm mt-1 mx-auto" onClick={() => handleDeleteClick(item)}>
          Delete
        </button>
      </td>
    </tr>
  );
};

export default ReadOnlyRow;