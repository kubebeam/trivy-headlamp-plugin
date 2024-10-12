/**
 * 
 * 
 *
 * The version of the OpenAPI document: 
 * Contact Email: 
 * License: 
 *
 * NOTE: This file is auto generated by crdtotypes (https://github.com/yaacov/crdtoapi/).
 * https://github.com/yaacov/crdtoapi/README.crdtotypes
 */

/**
 * Scanner is the spec for a scanner generating a security assessment report.
 *
 * @export
 */
export interface RbacAssessmentReportReportScanner {
  /** name
   * Name the name of the scanner.
   *
   * @required {true}
   */
  name: string;
  /** vendor
   * Vendor the name of the vendor providing the scanner.
   *
   * @required {true}
   */
  vendor: string;
  /** version
   * Version the version of the scanner.
   *
   * @required {true}
   */
  version: string;
}
