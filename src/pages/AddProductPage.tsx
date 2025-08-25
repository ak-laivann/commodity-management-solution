import AddViewProduct from "@/components/custom/AddViewProduct";
import { useAddProduct } from "@/hooks/useProduct";
import { Form } from "antd";

export const AddProductPage = () => {
  const [form] = Form.useForm();
  const postProduct = useAddProduct(() => {
    form.resetFields();
  });

  return (
    <AddViewProduct
      externalForm={form}
      isViewPage={false}
      onSaveAsDraft={(data) => postProduct.mutate(data)}
      onSubmit={(data) => {
        postProduct.mutate(data);
      }}
    />
  );
};
