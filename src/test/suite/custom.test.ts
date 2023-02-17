import * as assert from "assert";

import { oldApglLicenses } from "../../commands";
import { CustomLicense, LicenseItem } from "../../types";
import { getLicense } from "../../api";
import { replaceAuthor, replaceYear } from "../../utils";


describe("Custom Licenses Test", () => {
  let licenses: LicenseItem[];
  before(async () => {
    licenses = oldApglLicenses;
    describe(`Utils on each license`, () => {
      licenses.forEach((license) => {
        switch (license.key) {
          case "agpl-1.0":
          case "agpl-2.0":
            it(`successfully got license ${license.key}`, async () => {
              const _license = await getLicense(license.key);
              if (_license) {
                assert.ok(true, `_license: ${JSON.stringify(_license, null, 2)}`);
              } else {
                assert.fail(`_license: ${JSON.stringify(_license, null, 2)}`);
              }
            });
            it(`author and year not replaced in ${license.key}`, async () => {
              const l = await getLicense(license.key) as CustomLicense;
              const authorReplaced = replaceAuthor("John Doe", l.key, l.body ? l.body : l.text);
              const yearReplaced = replaceYear("1941", l.key, l.body ? l.body : l.text);
              assert.ok(authorReplaced.indexOf("John Doe") === -1);
              assert.ok(yearReplaced.indexOf("1941") === -1);
            });
            break;
          default:
            it(`unknown license '${license.key}'`, async () => {
              assert.fail(`license: ${JSON.stringify(license, null, 2)}\n====\nlicenses:\n${JSON.stringify(licenses, null, 2)}`);
            });
            break;
        }
      });
    });
  });

  it(`should be 2 licenses`, () => {
    assert.ok(licenses.length === 2);
  });
});