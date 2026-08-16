import { createClient } from "microcms-js-sdk";

// microCMSと通信するための設定
export const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
});

// toukouの投稿を「全件」取得する（microCMSは1回のリクエストにつき最大100件までしか
// 返さないため、100件を超える場合はoffsetをずらして繰り返し取得する）
export async function getAllPosts(extraQueries = {}) {
  const limit = 100;
  let offset = 0;
  let all = [];

  while (true) {
    const res = await client.get({
      endpoint: "toukou",
      queries: { ...extraQueries, limit, offset },
    });
    all = all.concat(res.contents);
    if (res.contents.length === 0 || all.length >= res.totalCount) break;
    offset += limit;
  }

  return all;
}

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

// 日付を yyyy/mm/dd 形式（ゼロ埋め）に整形する
export function formatDate(dateStr) {
  const d = new Date(dateStr);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}/${mm}/${dd}`;
}