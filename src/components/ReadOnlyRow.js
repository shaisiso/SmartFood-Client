import React from "react";

const ReadOnlyRow = ({ item, handleEditClick, handleDeleteClick }) => {
  return (
    // <tr >
    //   <td className="align-middle">{item.name}</td>
    //   <td className="align-middle">{item.category}</td>
    //   <td className="align-middle">{item.description}</td>
    //   <td className="align-middle">{item.price}</td>
    //   <td>
    //     <button
    //       type="button"
    //       className="form-control btn btn-info mx-auto"
    //       onClick={(event) => handleEditClick(event, item)}
    //     >
    //       Edit
    //     </button>
    //     <button type="button" className="form-control btn btn-danger mt-1 mx-auto" onClick={() => handleDeleteClick(item)}>
    //       Delete
    //     </button>
    //   </td>
    // </tr>
    <tr>
      {
        Object.values(item).map((property, key) =>
          <td key={key} className="align-middle">{property}</td>
        )}
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