import axios from "axios";

export const fetchImageAsFile = async (url: string) =>{
    try {
        const response = await axios.get(url, {
          responseType: 'arraybuffer'
        });
        const byteArray = new Uint8Array(response.data);
    
        const file = new File([byteArray], url.substring(url.lastIndexOf("/")));
        return file;
      } catch (error) {
        console.error('Error while getting an image', error);
        return null;
      }
}