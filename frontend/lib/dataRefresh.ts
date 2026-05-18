export const DATA_REFRESH_EVENT = "mini-ecommerce:data-refresh";
export const DATA_REFRESH_STORAGE_KEY = "mini-ecommerce:data-refresh-ts";

export function emitDataRefresh() {
  window.dispatchEvent(new Event(DATA_REFRESH_EVENT));
  localStorage.setItem(
    DATA_REFRESH_STORAGE_KEY,
    new Date().getTime().toString()
  );
}
