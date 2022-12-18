import React from "react";

const ReadOnlyRow = ({ item, withId, handleEditClick, handleDeleteClick, rowColor }) => {
  return (
    <tr style={{backgroundColor: rowColor ? rowColor: 'default'}}>
      {
        Object.values(item).map((property, key) =>
           withId || key > 0 ?
            <td key={key} className="align-middle ">{property}</td>
            :
            null
        )}
      {
        handleEditClick && handleDeleteClick ?
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
          :
          null
      }

    </tr>
  );
};

export default ReadOnlyRow;