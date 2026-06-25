export function getProductImage(product) {
  if (!product) return '/placeholder.png';
  const title = product.title || '';
  const lower = title.toLowerCase();
  
  if (lower.includes('compartment') || lower.includes('stainless')) {
    return '/stainless_lunchbox.png';
  }
  if (lower.includes('mouse') || lower.includes('wireless')) {
    return '/wireless_mouse.png';
  }
  if (lower.includes('flash drive') || lower.includes('usb') || lower.includes('geonix')) {
    return '/usb_drive.png';
  }
  if (lower.includes('kids lunch box') || lower.includes('bottle')) {
    return '/kids_lunchbox.png';
  }
  if (lower.includes('nuco')) {
    return '/stainless_lunchbox.png';
  }
  if (lower.includes('split ac') || lower.includes('ac')) {
    return '/split_ac.png';
  }
  if (lower.includes('refrigerator')) {
    return '/refrigerator.png';
  }
  if (lower.includes('microwave')) {
    return '/microwave.png';
  }
  if (lower.includes('washing machine') || lower.includes('automatic')) {
    return '/washing_machine.png';
  }
  
  return product.image_url || '/placeholder.png';
}
