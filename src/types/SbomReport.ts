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

import { ObjectMeta } from './ObjectMeta';
import { SbomReportReport } from './SbomReportReport';

/**
 * SbomReport summarizes components and dependencies found in container image
 *
 * @export
 */
export interface SbomReport {
  /** apiVersion
   * APIVersion defines the versioned schema of this representation of an object.
Servers should convert recognized schemas to the latest internal value, and
may reject unrecognized values.
More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
   *
   * @required {true}
   */
  apiVersion: string;
  /** kind
   * Kind is a string value representing the REST resource this object represents.
Servers may infer this from the endpoint the client submits requests to.
Cannot be updated.
In CamelCase.
More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
   *
   * @required {true}
   */
  kind: string;
  /** metadata
   *
   * @required {false}
   * @originalType {SbomReportMetadata}
   */
  metadata: ObjectMeta;
  /** report
   * Report is the actual sbom report data.
   *
   * @required {true}
   */
  report: SbomReportReport;
}
