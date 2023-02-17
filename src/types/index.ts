/* eslint-disable @typescript-eslint/naming-convention */
import { ResponseHeaders, Url } from "@octokit/types";

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type LicenseItem = Optional<
  Omit<
    License,
    | "description"
    | "implementation"
    | "permissions"
    | "conditions"
    | "limitations"
    | "body"
    | "featured"
  >,
  "html_url"
>;

export type CustomResponse<T, S extends number = number> = {
  status: S;
  url: string;
  data: T;
};

export interface CustomLicense extends License {
  key: string;
  name: string;
  short_name: string;
  category: string;
  owner: string;
  homepage_url: string;
  spdx_license_key: string;
  text_urls: string[];
  faq_url: string;
  ignorable_copyrights: string[];
  ignorable_holders: string[];
  text: string;
};

export interface License {
  key: string;
  name: string;
  spdx_id: string | null;
  url: string | null;
  node_id: string;
  html_url: string;
  description: string;
  implementation: string;
  permissions: string[];
  conditions: string[];
  limitations: string[];
  body: string;
  featured: boolean;
}
