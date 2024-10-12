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

import { InfraAssessmentReportReportChecks } from './InfraAssessmentReportReportChecks';
import { InfraAssessmentReportReportScanner } from './InfraAssessmentReportReportScanner';
import { InfraAssessmentReportReportSummary } from './InfraAssessmentReportReportSummary';

export interface InfraAssessmentReportReport {
  /** checks
   * Check provides the result of conducting a single audit step.
   *
   * @required {true}
   */
  checks: InfraAssessmentReportReportChecks[];
  /** scanner
   * Scanner is the spec for a scanner generating a security assessment report.
   *
   * @required {true}
   */
  scanner: InfraAssessmentReportReportScanner;
  /** summary
   * InfraAssessmentSummary counts failed checks by severity.
   *
   * @required {true}
   */
  summary: InfraAssessmentReportReportSummary;
}