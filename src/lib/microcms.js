import { createClient } from "microcms-js-sdk";

// microCMSと通信するための設定
export const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
});

// シリーズ名を取り出す（テキスト欄でも複数選択欄でも文字列に揃える）
export function getSeriesName(novel) {
  const raw = novel && novel.series;
  if (!raw) return "";
  if (Array.isArray(raw)) return String(raw[0] || "").trim();
  return String(raw).trim();
}

// 参考楽曲URLを配列で取り出す（改行区切り・カンマ区切り・配列のどれでも対応）
export function getMusicUrls(novel) {
  const raw = novel && novel.musicUrl;
  if (!raw) return [];
  const list = Array.isArray(raw) ? raw : String(raw).split(/\r?\n|,/);
  return list.map((u) => String(u).trim()).filter(Boolean);
}