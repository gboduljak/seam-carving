import FormData from "form-data";
export default class ImageResizeService {
  buildImageResizeModel({ file, dimensions, crop }) {
    const seamCarvingFormData = new FormData();
    const { width, height } = dimensions;

    seamCarvingFormData.set("image", file);
    seamCarvingFormData.set("crop_rows", parseInt(width - crop.width));
    seamCarvingFormData.set("crop_cols", parseInt(height - crop.height));
    return seamCarvingFormData;
  }
}
