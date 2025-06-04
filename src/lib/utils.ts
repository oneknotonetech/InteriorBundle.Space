// lib/utils.ts - Updated download utilities

export const LOCAL_STORAGE_KEY = 'ai-design-user-rows';

// Fixed downloadImage function that properly handles blob URLs
export const downloadImage = async (imageUrl: string, filename: string) => {
  try {
    let blob: Blob;
    
    // Check if it's a blob URL (from IndexedDB)
    if (imageUrl.startsWith('blob:')) {
      // Fetch the blob from the blob URL
      const response = await fetch(imageUrl);
      blob = await response.blob();
    } else {
      // Handle regular URLs (like generated images from server)
      const response = await fetch(imageUrl);
      blob = await response.blob();
    }
    
    // Create a new blob URL for download
    const downloadUrl = window.URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the download URL after a short delay
    setTimeout(() => {
      window.URL.revokeObjectURL(downloadUrl);
    }, 1000);
    
  } catch (error) {
    console.error('Download failed:', error);
    // Fallback: try direct link approach
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Alternative download function specifically for IndexedDB stored images
export const downloadImageFromBlob = async (blob: Blob, filename: string) => {
  try {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 1000);
  } catch (error) {
    console.error('Blob download failed:', error);
  }
};

// Function to download multiple images as a zip (optional enhancement)
export const downloadImagesAsZip = async (images: Array<{url: string, name: string}>) => {
  try {
    // This would require a zip library like JSZip
    // For now, download individually with delay
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      await downloadImage(image.url, image.name);
      // Add small delay between downloads
      if (i < images.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  } catch (error) {
    console.error('Multiple download failed:', error);
  }
};

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}