import { workspace } from "vscode";
import { Octokit } from "@octokit/rest";
import { request, RequestOptions } from "node:https";

import { LicenseItem, License, CustomResponse, CustomLicense } from "../types";
import { oldApglLicenses } from "../commands";

const octokit = new Octokit({
  auth: workspace.getConfiguration("license").get<string>("token"),
});

const createOptions = (url: string): RequestOptions => {
  const preOptions = {
    hostname: 'flaviocopes.com',
    port: 443,
    path: '/todos',
    method: 'Get'
  } as RequestOptions;
  if (url.startsWith("http:")) {
    preOptions.port = 80;
  }
  preOptions.hostname = new URL(url).hostname;
  preOptions.path = new URL(url).pathname;
  return preOptions;
};

const doHttpRequest = (url: string): Promise<CustomResponse<CustomLicense>> => {
  const options = createOptions(url);
  return new Promise<CustomResponse<CustomLicense>>((resolve, reject) => {
    const req = request(options, (res) => {
      res.setEncoding('utf8');
      let responseBody = '';

      res.on('data', (chunk) => {
        responseBody += chunk;
      });

      res.on('end', () => {
        const response = {
          url: res.url,
          data: JSON.parse(responseBody) as CustomLicense,
          status: res.statusCode
        } as CustomResponse<CustomLicense>;
        resolve(response);
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
};

export const getLicenses = async (): Promise<LicenseItem[]> => {
  const resp = await octokit.rest.licenses.getAllCommonlyUsed();
  return resp.data;
};

export const getLicense = async (key: string): Promise<License> => {
  const oldAgplLicenseTest = oldApglLicenses.find((x) => x.key === key);
  if (oldAgplLicenseTest && oldAgplLicenseTest.url) {
    const resp = await doHttpRequest(oldAgplLicenseTest.url);
    console.log(resp.data);
    return resp.data;
  } else {
    const resp = await octokit.rest.licenses.get({ license: key });
    return resp.data;
  }
};
