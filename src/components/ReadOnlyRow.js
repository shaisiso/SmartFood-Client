import React from "react";

const ReadOnlyRow = ({ item, withId, handleEditClick, handleDeleteClick, rowColor, handleGenerateClick }) => {
  return (
    <tr style={{ backgroundColor: rowColor ? rowColor : 'default' }}>
      {
        Object.values(item).slice(withId ? 0 : 1).map((property, key) => <td key={key} className="align-middle ">{property}</td>)
      }
      {
        handleEditClick || handleDeleteClick ?
          <td className="align-middle ">
            {
              handleGenerateClick ?
                <button type="button" className="form-control btn btn-primary btn-sm mb-1 mx-auto " onClick={(e) => handleGenerateClick(e, item)}>
                  QR Code
                </button>
                : null
            }
            {
              handleEditClick ?
                <button type="button" className="form-control btn btn-info  btn-sm mx-auto " onClick={(event) => handleEditClick(event, item)}
                >
                  Edit
                </button>
                :
                null
            }
            {
              handleDeleteClick ?
                <button type="button" className="form-control btn btn-danger btn-sm mt-1 mx-auto " onClick={(e) => handleDeleteClick(e, item)}>
                  Delete
                </button>
                : null
            }

          </td>
          :
          null
      }

    </tr>
  );
};

export default ReadOnlyRow;