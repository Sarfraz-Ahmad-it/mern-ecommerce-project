import { useParams } from "react-router-dom";

function EditProduct() {
  const { id } = useParams();

  return <h1>Edit Product {id}</h1>;
}

export default EditProduct;