import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, Modal, Form } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { Image } from "lucide-react";
import { type Product, Product_Creation_Status } from "@/components/props";

interface AddViewProductProps {
  isViewPage?: boolean;
  onSubmit?: (data: Product) => void;
  onSaveAsDraft?: (data: Product) => void;
  viewProductData?: Partial<Product>;
  externalForm?: any;
}

export default function AddViewProduct({
  isViewPage = false,
  onSubmit,
  onSaveAsDraft,
  viewProductData,
  externalForm,
}: AddViewProductProps) {
  const [previewFiles, setPreviewFiles] = useState<UploadFile[]>([]);
  const [thumbnailFiles, setThumbnailFiles] = useState<UploadFile[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const form = externalForm ?? Form.useForm()[0];

  useEffect(() => {
    if (viewProductData) {
      form.setFieldsValue({
        productName: viewProductData.productName,
        productCategory: viewProductData.productCategory,
        productDescription: viewProductData.productDescription,
        productTags: viewProductData.tags?.join(", ") || "",
        price: viewProductData.pricing?.price,
        discount: viewProductData.pricing?.discount,
        discountCategory: viewProductData.pricing?.discounCategory,
      });

      if (viewProductData.file?.previewimage) {
        setPreviewFiles(
          Array.isArray(viewProductData.file.previewimage)
            ? viewProductData.file.previewimage
            : [
                {
                  uid: "-1",
                  name: "preview",
                  status: "done",
                  url:
                    typeof viewProductData.file.previewimage === "string"
                      ? viewProductData.file.previewimage
                      : undefined,
                },
              ]
        );
      }

      if (viewProductData.file?.thumbnailfile) {
        setThumbnailFiles(
          Array.isArray(viewProductData.file.thumbnailfile)
            ? viewProductData.file.thumbnailfile
            : [
                {
                  uid: "-2",
                  name: "thumbnail",
                  status: "done",
                  url:
                    typeof viewProductData.file.thumbnailfile === "string"
                      ? viewProductData.file.thumbnailfile
                      : undefined,
                },
              ]
        );
      }
    }
  }, [viewProductData, form]);

  const handleSaveClick = () => setIsModalVisible(true);
  const handleCancelModal = () => setIsModalVisible(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const productData: Product = {
        ...values,
        status: Product_Creation_Status.PUBLISHED,
        tags: values.productTags
          ? values.productTags.split(",").map((tag: string) => tag.trim())
          : [],
        pricing: {
          price: parseFloat(values.price),
          discount: parseFloat(values.discount),
          discounCategory: values.discountCategory,
        },
        file: {
          thumbnailfile: thumbnailFiles,
          previewimage: previewFiles,
        },
      };
      await onSubmit?.(productData);
      setIsModalVisible(false);
      setPreviewFiles([]);
      setThumbnailFiles([]);
    } catch (err) {
      console.error("Validation Failed:", err);
    }
  };

  const handleSaveAsDraft = async () => {
    try {
      const values = await form.validateFields();
      const draftData: Product = {
        status: Product_Creation_Status.DRAFT,
        productName: values.productName,
        productCategory: values.productCategory,
        productDescription: values.productDescription,
        tags: values.productTags
          ? values.productTags.split(",").map((tag: string) => tag.trim())
          : [],
        pricing: {
          price: parseFloat(values.price),
          discount: parseFloat(values.discount),
          discounCategory: values.discountCategory,
        },
        file: {
          thumbnailfile: thumbnailFiles,
          previewimage: previewFiles,
        },
      };
      await onSaveAsDraft?.(draftData);
      setIsModalVisible(false);
    } catch (err) {
      console.error("Validation Failed:", err);
    }
  };

  return (
    <Form form={form} layout="vertical" className="px-4 space-y-4">
      <Card className="w-full shadow-md">
        <CardContent className="flex justify-between items-center px-4">
          <h2 className="text-xl font-semibold">
            {isViewPage ? "Product Name" : "Add New Product"}
          </h2>
          <div className="flex gap-8">
            <Button
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-50"
              onClick={() => form.resetFields()}
            >
              Discard Changes
            </Button>
            <Button type="button" onClick={handleSaveClick}>
              Save
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Form.Item
                style={{ marginBottom: "0" }}
                name="productName"
                label={<Label htmlFor="productName">Product Name</Label>}
                rules={[{ required: true, message: "Product name required" }]}
              >
                <Input id="productName" placeholder="Product Name" />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "0" }}
                name="productCategory"
                label={
                  <Label htmlFor="productCategory">Product Category</Label>
                }
                rules={[{ required: true, message: "Category required" }]}
              >
                <Input id="productCategory" placeholder="Product category" />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "0" }}
                name="productDescription"
                label={<Label htmlFor="productDescription">Description</Label>}
                rules={[{ required: true, message: "Description required" }]}
              >
                <Textarea
                  style={{ minHeight: "100px" }}
                  id="productDescription"
                  placeholder="Enter description"
                />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "0" }}
                name="productTags"
                label={<Label htmlFor="productTags">Tags/Keywords</Label>}
              >
                <Textarea
                  style={{ minHeight: "100px" }}
                  id="productTags"
                  placeholder="Comma separated tags"
                />
              </Form.Item>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Form.Item
                  style={{ marginBottom: "0" }}
                  name="price"
                  label={<Label htmlFor="price">Price</Label>}
                  rules={[{ required: true, message: "Price required" }]}
                >
                  <Input id="price" type="number" placeholder="Enter price" />
                </Form.Item>
              </div>

              <Form.Item
                style={{ marginBottom: "0" }}
                name="discount"
                label={<Label htmlFor="discount">Discount</Label>}
              >
                <Input
                  id="discount"
                  type="number"
                  placeholder="Enter discount"
                />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "0" }}
                name="discountCategory"
                label={
                  <Label htmlFor="discountCategory">Discount Category</Label>
                }
              >
                <Input
                  id="discountCategory"
                  placeholder="Enter discount category"
                />
              </Form.Item>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preview Product</CardTitle>
              <CardDescription>Drag and Drop your image here</CardDescription>
            </CardHeader>
            <CardContent>
              <Upload
                maxCount={1}
                style={{ width: "100%", height: "200px" }}
                accept="image/*"
                listType="picture-card"
                fileList={previewFiles}
                onChange={({ fileList }) => setPreviewFiles(fileList)}
              >
                <Image /> &nbsp;
                <p className="text-gray-300">Drag and drop here</p>
              </Upload>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thumbnail Product</CardTitle>
              <CardDescription>Drag and Drop your image here</CardDescription>
            </CardHeader>
            <CardContent>
              <Upload
                maxCount={1}
                style={{ width: "100%", height: "200px" }}
                accept="image/*"
                listType="picture-card"
                fileList={thumbnailFiles}
                onChange={({ fileList }) => setThumbnailFiles(fileList)}
              >
                <Image /> &nbsp;
                <p className="text-gray-300">Drag and drop here</p>
              </Upload>
            </CardContent>
          </Card>
        </div>
      </div>

      <Modal
        title="Are you sure to submit the details?"
        open={isModalVisible}
        onCancel={handleCancelModal}
        footer={[
          <Button
            key="draft"
            variant="outline"
            className="mr-4 border-gray-400 text-gray-700"
            onClick={handleSaveAsDraft}
          >
            Save as Draft
          </Button>,
          <Button key="submit" onClick={handleSubmit}>
            Submit
          </Button>,
        ]}
      />
    </Form>
  );
}
