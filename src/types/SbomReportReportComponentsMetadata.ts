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

import { SbomReportReportComponentsComponents } from './SbomReportReportComponentsComponents';
import { SbomReportReportComponentsMetadataTools } from './SbomReportReportComponentsMetadataTools';

export interface SbomReportReportComponentsMetadata {
  /** component
   *
   * @required {false}
   */
  component?: SbomReportReportComponentsComponents;
  /** timestamp
   *
   * @required {false}
   */
  timestamp?: string;
  /** tools
   *
   * @required {false}
   */
  tools?: SbomReportReportComponentsMetadataTools;
}
