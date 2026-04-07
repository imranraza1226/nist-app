import { Control } from '../types';

export const NIST_CONTROLS: Omit<Control, 'id'>[] = [
  // ============================================================
  // NIST CSF 2.0 — GOVERN
  // ============================================================
  {
    control_id: 'GV.OC-01',
    title: 'Organizational Context',
    description:
      'The organizational mission is understood and informs cybersecurity risk management.',
    implementation_guidance:
      'Document the organization\'s mission, vision, and strategic objectives. Ensure cybersecurity risk management decisions align with mission priorities. Conduct regular reviews to verify alignment between cybersecurity posture and organizational goals. Involve senior leadership in defining acceptable risk thresholds.',
    framework: 'csf2',
    function_category: 'Govern',
    family: 'Organizational Context',
    related_controls: ['GV.OC-02', 'GV.OC-03', 'ID.RA-01'],
    tags: ['governance', 'mission', 'strategy', 'risk-management'],
  },
  {
    control_id: 'GV.OC-02',
    title: 'Internal and External Requirements',
    description:
      'Internal and external requirements are understood and inform the management of cybersecurity risk.',
    implementation_guidance:
      'Catalog all applicable laws, regulations, contractual obligations, and internal policies relevant to cybersecurity. Maintain a regulatory register and review it at least annually. Engage legal, compliance, and business units to identify emerging requirements. Map requirements to specific cybersecurity controls.',
    framework: 'csf2',
    function_category: 'Govern',
    family: 'Organizational Context',
    related_controls: ['GV.OC-01', 'GV.PO-01', 'ID.RA-01'],
    tags: ['compliance', 'regulations', 'requirements', 'legal'],
  },
  {
    control_id: 'GV.OC-03',
    title: 'Legal and Regulatory Requirements',
    description:
      'Legal, regulatory, and contractual requirements regarding cybersecurity are understood and managed.',
    implementation_guidance:
      'Establish a process to identify, track, and respond to changes in legal and regulatory requirements. Assign ownership for each regulatory requirement. Implement controls to satisfy requirements and document evidence of compliance. Engage outside counsel and regulatory consultants as needed.',
    framework: 'csf2',
    function_category: 'Govern',
    family: 'Organizational Context',
    related_controls: ['GV.OC-02', 'GV.SC-06', 'ID.RA-02'],
    tags: ['legal', 'regulatory', 'contractual', 'compliance'],
  },
  {
    control_id: 'GV.PO-01',
    title: 'Cybersecurity Policy',
    description:
      'Cybersecurity policy is established, communicated, and enforced.',
    implementation_guidance:
      'Develop a comprehensive cybersecurity policy approved by senior management. Distribute the policy to all personnel and require acknowledgment. Review and update the policy at least annually or after significant incidents. Include policy exceptions management procedures. Align policy with applicable regulations and industry standards.',
    framework: 'csf2',
    function_category: 'Govern',
    family: 'Policy',
    related_controls: ['GV.PO-02', 'GV.RR-01', 'PR.AT-01'],
    tags: ['policy', 'governance', 'compliance', 'enforcement'],
  },
  {
    control_id: 'GV.PO-02',
    title: 'Cybersecurity Roles and Responsibilities',
    description:
      'Cybersecurity roles, responsibilities, and authorities are established, communicated, and coordinated.',
    implementation_guidance:
      'Define and document cybersecurity roles including CISO, security engineers, data custodians, and system owners. Create a RACI matrix for all security functions. Communicate responsibilities to all relevant personnel. Review and update role assignments when organizational changes occur. Establish escalation paths for security incidents.',
    framework: 'csf2',
    function_category: 'Govern',
    family: 'Policy',
    related_controls: ['GV.PO-01', 'GV.RR-01', 'GV.RR-02'],
    tags: ['roles', 'responsibilities', 'CISO', 'governance', 'authority'],
  },
  // ============================================================
  // NIST CSF 2.0 — IDENTIFY
  // ============================================================
  {
    control_id: 'ID.AM-01',
    title: 'Asset Inventory — Hardware',
    description:
      'Inventories of hardware managed by the organization are maintained.',
    implementation_guidance:
      'Deploy automated asset discovery tools to scan networks continuously. Maintain a Configuration Management Database (CMDB) with all hardware assets. Include asset owner, location, classification, and lifecycle status. Reconcile inventory against purchasing and disposal records quarterly. Integrate with change management processes.',
    framework: 'csf2',
    function_category: 'Identify',
    family: 'Asset Management',
    related_controls: ['ID.AM-02', 'ID.AM-03', 'PR.DS-01'],
    tags: ['asset-management', 'hardware', 'inventory', 'CMDB'],
  },
  {
    control_id: 'ID.AM-02',
    title: 'Asset Inventory — Software',
    description:
      'Inventories of software, services, and systems managed by the organization are maintained.',
    implementation_guidance:
      'Implement software asset management (SAM) tools to track all applications. Maintain an approved software list and verify installations against it. Track software licenses, versions, and patch status. Include cloud services, SaaS, and open-source components. Review inventory monthly and reconcile with procurement records.',
    framework: 'csf2',
    function_category: 'Identify',
    family: 'Asset Management',
    related_controls: ['ID.AM-01', 'ID.AM-03', 'PR.DS-01'],
    tags: ['asset-management', 'software', 'inventory', 'SAM', 'licenses'],
  },
  {
    control_id: 'ID.RA-01',
    title: 'Risk Identification',
    description:
      'Vulnerabilities in assets are identified, validated, and recorded.',
    implementation_guidance:
      'Conduct vulnerability assessments and penetration testing regularly. Subscribe to threat intelligence feeds and CVE notifications. Maintain a risk register documenting all identified vulnerabilities with severity ratings. Prioritize remediation based on CVSS scores and business impact. Track remediation progress and report to leadership.',
    framework: 'csf2',
    function_category: 'Identify',
    family: 'Risk Assessment',
    related_controls: ['ID.RA-02', 'ID.RA-03', 'ID.IM-01'],
    tags: ['risk', 'vulnerability', 'assessment', 'CVE', 'penetration-testing'],
  },
  {
    control_id: 'ID.RA-02',
    title: 'Threat Intelligence',
    description:
      'Cyber threat intelligence is received from information sharing forums and sources.',
    implementation_guidance:
      'Subscribe to industry-specific ISACs, US-CERT, and commercial threat feeds. Establish processes to consume, analyze, and act on threat intelligence. Share relevant threat information with peers in the industry. Integrate threat intelligence into security monitoring and incident response procedures.',
    framework: 'csf2',
    function_category: 'Identify',
    family: 'Risk Assessment',
    related_controls: ['ID.RA-01', 'DE.CM-01', 'RS.CO-05'],
    tags: ['threat-intelligence', 'ISAC', 'sharing', 'monitoring'],
  },
  {
    control_id: 'ID.SC-01',
    title: 'Supply Chain Risk Management',
    description:
      'A supply chain risk management process is identified, established, assessed, managed, and agreed to by organizational stakeholders.',
    implementation_guidance:
      'Develop a Supply Chain Risk Management (SCRM) plan addressing vendor assessment, contractual requirements, and ongoing monitoring. Conduct due diligence on critical suppliers including security assessments. Include cybersecurity requirements in vendor contracts (SLAs, right-to-audit clauses). Monitor supplier security posture continuously.',
    framework: 'csf2',
    function_category: 'Identify',
    family: 'Supply Chain Risk Management',
    related_controls: ['ID.SC-02', 'GV.SC-06', 'DE.CM-01'],
    tags: ['supply-chain', 'vendor', 'third-party', 'SCRM', 'procurement'],
  },
  // ============================================================
  // NIST CSF 2.0 — PROTECT
  // ============================================================
  {
    control_id: 'PR.AA-01',
    title: 'Identity Management',
    description:
      'Identities and credentials for authorized users, services, and hardware are managed by the organization.',
    implementation_guidance:
      'Implement an identity management system with a centralized directory (Active Directory, LDAP, or cloud IdP). Enforce strong password policies: minimum 12 characters, complexity requirements, and expiration. Implement multi-factor authentication (MFA) for all privileged and remote access. Conduct quarterly access reviews and promptly deprovision terminated users.',
    framework: 'csf2',
    function_category: 'Protect',
    family: 'Identity Management, Authentication, and Access Control',
    related_controls: ['PR.AA-02', 'PR.AA-03', 'PR.AA-05'],
    tags: ['identity', 'IAM', 'credentials', 'MFA', 'access-control'],
  },
  {
    control_id: 'PR.AA-02',
    title: 'Authentication',
    description:
      'Identities are proofed and bound to credentials based on the context of interactions.',
    implementation_guidance:
      'Implement risk-based authentication that considers user context, device health, and location. Deploy phishing-resistant MFA (FIDO2/WebAuthn) for privileged accounts. Implement certificate-based authentication for service accounts. Establish identity proofing procedures aligned with NIST SP 800-63 assurance levels.',
    framework: 'csf2',
    function_category: 'Protect',
    family: 'Identity Management, Authentication, and Access Control',
    related_controls: ['PR.AA-01', 'PR.AA-03', 'PR.AA-06'],
    tags: ['authentication', 'MFA', 'FIDO2', 'zero-trust', 'identity-proofing'],
  },
  {
    control_id: 'PR.DS-01',
    title: 'Data-at-Rest Protection',
    description:
      'The confidentiality, integrity, and availability of data-at-rest are protected.',
    implementation_guidance:
      'Encrypt sensitive data at rest using AES-256 or equivalent strong encryption. Implement full-disk encryption on all laptops and mobile devices. Classify data by sensitivity level and apply controls accordingly. Use database encryption for sensitive data stores. Manage encryption keys using a dedicated KMS (Key Management Service).',
    framework: 'csf2',
    function_category: 'Protect',
    family: 'Data Security',
    related_controls: ['PR.DS-02', 'PR.DS-10', 'PR.AA-01'],
    tags: ['encryption', 'data-at-rest', 'AES-256', 'data-protection', 'KMS'],
  },
  {
    control_id: 'PR.DS-02',
    title: 'Data-in-Transit Protection',
    description:
      'The confidentiality, integrity, and availability of data-in-transit are protected.',
    implementation_guidance:
      'Enforce TLS 1.2 or higher for all data transmissions. Disable weak cipher suites and deprecated protocols (SSL, TLS 1.0/1.1). Implement certificate pinning for critical applications. Use VPN or mTLS for service-to-service communication. Monitor for clear-text transmission of sensitive data.',
    framework: 'csf2',
    function_category: 'Protect',
    family: 'Data Security',
    related_controls: ['PR.DS-01', 'PR.DS-10', 'PR.AA-02'],
    tags: ['encryption', 'TLS', 'data-in-transit', 'VPN', 'network-security'],
  },
  {
    control_id: 'PR.IR-01',
    title: 'Network Integrity',
    description:
      'Networks and environments are protected from unauthorized logical access and usage.',
    implementation_guidance:
      'Implement network segmentation using VLANs, firewalls, and microsegmentation. Deploy next-generation firewalls with application-layer inspection. Implement Zero Trust Network Access (ZTNA) architecture. Enforce least-privilege network access. Monitor network traffic for anomalies using IDS/IPS systems.',
    framework: 'csf2',
    function_category: 'Protect',
    family: 'Infrastructure Resilience',
    related_controls: ['PR.IR-02', 'DE.CM-01', 'PR.DS-02'],
    tags: ['network-security', 'segmentation', 'firewall', 'zero-trust', 'ZTNA'],
  },
  // ============================================================
  // NIST CSF 2.0 — DETECT
  // ============================================================
  {
    control_id: 'DE.CM-01',
    title: 'Network Monitoring',
    description:
      'Networks and network services are monitored to find potentially adverse events.',
    implementation_guidance:
      'Deploy Security Information and Event Management (SIEM) for centralized log collection and correlation. Implement network traffic analysis (NTA) tools for behavioral analytics. Monitor DNS, firewall, proxy, and VPN logs continuously. Define detection rules and alerting thresholds. Integrate threat intelligence feeds into monitoring platform.',
    framework: 'csf2',
    function_category: 'Detect',
    family: 'Continuous Monitoring',
    related_controls: ['DE.CM-02', 'DE.CM-03', 'DE.AE-01'],
    tags: ['monitoring', 'SIEM', 'network', 'detection', 'logging'],
  },
  {
    control_id: 'DE.CM-06',
    title: 'External Service Provider Activity Monitoring',
    description:
      'External service provider activities and services are monitored to find potentially adverse events.',
    implementation_guidance:
      'Monitor third-party access sessions using privileged access workstations and session recording. Review vendor access logs regularly. Set up alerts for unusual access patterns from third parties. Require vendors to notify you of security incidents affecting your data within defined timeframes.',
    framework: 'csf2',
    function_category: 'Detect',
    family: 'Continuous Monitoring',
    related_controls: ['DE.CM-01', 'ID.SC-01', 'GV.SC-06'],
    tags: ['third-party', 'monitoring', 'vendor', 'supply-chain', 'logging'],
  },
  {
    control_id: 'DE.AE-02',
    title: 'Anomaly Analysis',
    description:
      'Potentially adverse events are analyzed to better understand associated activities.',
    implementation_guidance:
      'Establish baselines for normal user and network behavior using UEBA (User and Entity Behavior Analytics). Implement automated anomaly detection using ML-based tools. Define escalation procedures for detected anomalies. Conduct threat hunting activities to proactively identify hidden threats. Document and tune detection rules to reduce false positives.',
    framework: 'csf2',
    function_category: 'Detect',
    family: 'Adverse Event Analysis',
    related_controls: ['DE.AE-01', 'DE.CM-01', 'RS.AN-03'],
    tags: ['anomaly-detection', 'UEBA', 'threat-hunting', 'behavioral-analytics'],
  },
  {
    control_id: 'DE.AE-07',
    title: 'Cyber Threat Intelligence Integration',
    description:
      'Cyber threat intelligence and other contextual information are integrated into the analysis of adverse events.',
    implementation_guidance:
      'Integrate threat intelligence platform (TIP) with SIEM and SOAR solutions. Enrich security alerts with threat intelligence context (IOCs, TTPs). Use STIX/TAXII standards for threat intelligence sharing. Map detections to MITRE ATT&CK framework to understand adversary tactics.',
    framework: 'csf2',
    function_category: 'Detect',
    family: 'Adverse Event Analysis',
    related_controls: ['DE.AE-02', 'ID.RA-02', 'RS.AN-03'],
    tags: ['threat-intelligence', 'MITRE-ATTCK', 'IOCs', 'STIX', 'TAXII'],
  },
  {
    control_id: 'DE.CM-09',
    title: 'Computing Hardware and Software Monitoring',
    description:
      'Computing hardware and software, runtime environments, and their data are monitored to find potentially adverse events.',
    implementation_guidance:
      'Deploy Endpoint Detection and Response (EDR) solutions on all endpoints. Monitor process execution, file system changes, and registry modifications. Implement File Integrity Monitoring (FIM) for critical system files. Use application whitelisting to prevent unauthorized code execution. Collect and analyze host-based logs in the SIEM.',
    framework: 'csf2',
    function_category: 'Detect',
    family: 'Continuous Monitoring',
    related_controls: ['DE.CM-01', 'DE.CM-03', 'PR.DS-01'],
    tags: ['EDR', 'endpoint', 'FIM', 'monitoring', 'whitelisting'],
  },
  // ============================================================
  // NIST CSF 2.0 — RESPOND
  // ============================================================
  {
    control_id: 'RS.MA-01',
    title: 'Incident Response Plan',
    description:
      'The incident response plan is executed in coordination with relevant third parties once an incident is declared.',
    implementation_guidance:
      'Develop and maintain a comprehensive Incident Response Plan (IRP) with defined roles, procedures, and communication templates. Conduct annual tabletop exercises and full IR simulations. Maintain an up-to-date incident response contact list including legal, PR, and law enforcement contacts. Establish relationships with third-party IR retainer services.',
    framework: 'csf2',
    function_category: 'Respond',
    family: 'Incident Management',
    related_controls: ['RS.MA-02', 'RS.CO-01', 'RS.AN-03'],
    tags: ['incident-response', 'IRP', 'tabletop', 'playbook', 'coordination'],
  },
  {
    control_id: 'RS.CO-02',
    title: 'Incident Reporting',
    description:
      'Internal and external stakeholders are notified of incidents in a timely manner.',
    implementation_guidance:
      'Establish incident notification procedures with defined timelines for different incident severity levels. Create communication templates for internal stakeholders, customers, regulators, and media. Know regulatory notification requirements (GDPR 72 hours, HIPAA 60 days, SEC 4 days for material incidents). Designate authorized spokespersons for external communications.',
    framework: 'csf2',
    function_category: 'Respond',
    family: 'Incident Response Reporting and Communication',
    related_controls: ['RS.CO-01', 'RS.CO-03', 'RS.MA-01'],
    tags: ['incident-reporting', 'notification', 'GDPR', 'HIPAA', 'regulatory'],
  },
  {
    control_id: 'RS.AN-03',
    title: 'Incident Analysis',
    description:
      'Analysis is performed to establish what has taken place during an incident and the root cause of the incident.',
    implementation_guidance:
      'Conduct forensic analysis of affected systems using proper chain-of-custody procedures. Use the Diamond Model or MITRE ATT&CK framework to analyze attacker techniques. Document timeline of events, affected systems, and data exposure. Identify root cause and contributing factors. Preserve evidence for potential legal proceedings.',
    framework: 'csf2',
    function_category: 'Respond',
    family: 'Incident Analysis',
    related_controls: ['RS.AN-06', 'DE.AE-02', 'RS.MA-01'],
    tags: ['forensics', 'root-cause', 'MITRE-ATTCK', 'analysis', 'evidence'],
  },
  {
    control_id: 'RS.MI-01',
    title: 'Incident Containment',
    description:
      'Incidents are contained.',
    implementation_guidance:
      'Develop containment playbooks for common incident types (ransomware, data breach, DDoS, insider threat). Implement automated containment capabilities in SOAR platform. Define authority levels for isolation decisions to minimize business disruption. Test containment procedures in DR exercises. Balance containment against evidence preservation needs.',
    framework: 'csf2',
    function_category: 'Respond',
    family: 'Incident Mitigation',
    related_controls: ['RS.MI-02', 'RS.AN-03', 'RS.MA-01'],
    tags: ['containment', 'SOAR', 'playbook', 'isolation', 'incident-response'],
  },
  {
    control_id: 'RS.MI-02',
    title: 'Incident Eradication',
    description:
      'Incidents are eradicated.',
    implementation_guidance:
      'Remove malware and attacker footholds from all affected systems. Patch or remediate vulnerabilities exploited during the incident. Reset compromised credentials and revoke affected certificates. Verify eradication through security scanning before restoring services. Document all eradication steps for post-incident review.',
    framework: 'csf2',
    function_category: 'Respond',
    family: 'Incident Mitigation',
    related_controls: ['RS.MI-01', 'RS.MI-03', 'RC.RP-01'],
    tags: ['eradication', 'remediation', 'malware-removal', 'patching'],
  },
  // ============================================================
  // NIST CSF 2.0 — RECOVER
  // ============================================================
  {
    control_id: 'RC.RP-01',
    title: 'Recovery Plan',
    description:
      'The recovery portion of the incident response plan is executed once initiated from the incident response process.',
    implementation_guidance:
      'Develop Business Continuity Plans (BCP) and Disaster Recovery Plans (DRP) aligned with defined RTOs and RPOs. Test recovery plans annually through full DR exercises. Maintain up-to-date system recovery documentation and runbooks. Establish recovery priorities based on business impact analysis. Coordinate recovery with operations teams.',
    framework: 'csf2',
    function_category: 'Recover',
    family: 'Incident Recovery Plan Execution',
    related_controls: ['RC.RP-02', 'RC.RP-03', 'RS.MI-02'],
    tags: ['recovery', 'BCP', 'DRP', 'RTO', 'RPO', 'disaster-recovery'],
  },
  {
    control_id: 'RC.CO-03',
    title: 'Recovery Communication',
    description:
      'Recovery activities and progress in restoring operational capabilities are communicated to designated internal and external stakeholders.',
    implementation_guidance:
      'Establish a communications plan for recovery operations including status update cadence. Use a dedicated communication channel for recovery coordination (separate from potentially compromised systems). Provide regular updates to executives, customers, and regulators during recovery. Document lessons learned from recovery communications.',
    framework: 'csf2',
    function_category: 'Recover',
    family: 'Incident Recovery Communication',
    related_controls: ['RC.CO-01', 'RC.CO-02', 'RS.CO-02'],
    tags: ['communication', 'recovery', 'stakeholders', 'status-updates'],
  },
  {
    control_id: 'RC.RP-04',
    title: 'Integrity Verification',
    description:
      'The integrity of restored assets is verified, systems and services are restored, and normal operating status is confirmed.',
    implementation_guidance:
      'Verify file and system integrity using cryptographic hashes before returning systems to production. Conduct security scans and vulnerability assessments on recovered systems. Validate that business processes are functioning correctly post-recovery. Obtain sign-off from business owners before declaring recovery complete.',
    framework: 'csf2',
    function_category: 'Recover',
    family: 'Incident Recovery Plan Execution',
    related_controls: ['RC.RP-01', 'PR.DS-01', 'DE.CM-09'],
    tags: ['integrity', 'verification', 'recovery', 'validation', 'hashing'],
  },
  {
    control_id: 'RC.RP-06',
    title: 'Post-Incident Review',
    description:
      'Post-incident reviews are conducted and the results inform updates to the incident response and recovery plans.',
    implementation_guidance:
      'Conduct blameless post-incident reviews (PIRs) within 2 weeks of major incidents. Document timeline, root cause, impact, and improvement actions. Track action items to closure. Share anonymized lessons learned across the organization. Update incident response and recovery plans based on findings. Present outcomes to leadership.',
    framework: 'csf2',
    function_category: 'Recover',
    family: 'Incident Recovery Plan Execution',
    related_controls: ['RC.RP-01', 'RS.AN-03', 'ID.IM-01'],
    tags: ['post-incident', 'lessons-learned', 'continuous-improvement', 'PIR'],
  },
  {
    control_id: 'RC.RP-02',
    title: 'Backup and Recovery',
    description:
      'Recovery resources are available to support recovery objectives.',
    implementation_guidance:
      'Implement the 3-2-1 backup strategy: 3 copies, 2 different media types, 1 offsite. Test backup restoration quarterly and document results. Store backups in air-gapped or immutable storage to protect against ransomware. Define and test RTO (Recovery Time Objective) and RPO (Recovery Point Objective) for critical systems. Encrypt all backup data.',
    framework: 'csf2',
    function_category: 'Recover',
    family: 'Incident Recovery Plan Execution',
    related_controls: ['RC.RP-01', 'PR.DS-01', 'RC.RP-04'],
    tags: ['backup', 'recovery', 'RTO', 'RPO', '3-2-1', 'ransomware'],
  },
  // ============================================================
  // NIST SP 800-53 Rev 5 — ACCESS CONTROL (AC)
  // ============================================================
  {
    control_id: 'AC-1',
    title: 'Policy and Procedures',
    description:
      'Develop, document, and disseminate to designated personnel an access control policy that addresses purpose, scope, roles, responsibilities, management commitment, coordination among organizational entities, and compliance.',
    implementation_guidance:
      'Create a formal access control policy document reviewed and approved by senior management. Include policy scope, objectives, and applicability. Define roles responsible for policy compliance. Distribute to all employees and require annual acknowledgment. Review and update policy at least every 3 years or after significant changes.',
    framework: 'sp80053',
    function_category: 'Access Control',
    family: 'Access Control',
    related_controls: ['AC-2', 'AC-3', 'IA-1'],
    tags: ['policy', 'access-control', 'governance', 'documentation'],
  },
  {
    control_id: 'AC-2',
    title: 'Account Management',
    description:
      'Define and document the types of accounts allowed and specifically prohibited for use within the system. Manage system accounts, including establishing, activating, modifying, reviewing, disabling, and removing accounts.',
    implementation_guidance:
      'Implement formal account management procedures covering provisioning, modification, and deprovisioning workflows. Require management approval for account creation. Conduct quarterly access reviews for all privileged accounts. Automatically disable accounts after 90 days of inactivity. Implement just-in-time (JIT) access for privileged accounts. Log all account management actions.',
    framework: 'sp80053',
    function_category: 'Access Control',
    family: 'Access Control',
    related_controls: ['AC-3', 'AC-5', 'AC-6', 'IA-4'],
    tags: ['account-management', 'provisioning', 'access-reviews', 'privileged-access'],
  },
  {
    control_id: 'AC-3',
    title: 'Access Enforcement',
    description:
      'Enforce approved authorizations for logical access to information and system resources in accordance with applicable access control policies.',
    implementation_guidance:
      'Implement Role-Based Access Control (RBAC) or Attribute-Based Access Control (ABAC) aligned with least privilege. Configure access control lists (ACLs) on all systems and file shares. Use Privileged Access Management (PAM) solutions for administrative access. Implement data-level access controls using database security features. Test access controls regularly through access reviews and penetration testing.',
    framework: 'sp80053',
    function_category: 'Access Control',
    family: 'Access Control',
    related_controls: ['AC-2', 'AC-4', 'AC-6', 'IA-2'],
    tags: ['RBAC', 'ABAC', 'least-privilege', 'PAM', 'access-enforcement'],
  },
  // ============================================================
  // NIST SP 800-53 Rev 5 — AUDIT AND ACCOUNTABILITY (AU)
  // ============================================================
  {
    control_id: 'AU-1',
    title: 'Audit and Accountability Policy and Procedures',
    description:
      'Develop, document, and disseminate an audit and accountability policy that addresses purpose, scope, roles, responsibilities, management commitment, coordination, and compliance.',
    implementation_guidance:
      'Establish an audit policy defining what events must be logged, retention requirements, and review responsibilities. Include requirements for audit log protection, review frequency, and incident escalation. Align with regulatory requirements (SOX, PCI DSS, HIPAA). Publish audit policy and obtain management approval.',
    framework: 'sp80053',
    function_category: 'Audit and Accountability',
    family: 'Audit and Accountability',
    related_controls: ['AU-2', 'AU-3', 'AU-12'],
    tags: ['audit', 'accountability', 'logging', 'policy', 'compliance'],
  },
  {
    control_id: 'AU-2',
    title: 'Event Logging',
    description:
      'Identify the types of events that the system is capable of logging in support of the audit function and coordinate the event logging function with other organizations requiring audit-related information.',
    implementation_guidance:
      'Define comprehensive audit event types including authentication, authorization, data access, system changes, and security events. Ensure all critical systems are capable of generating required audit logs. Correlate logs across systems in a centralized SIEM. Document and review audit event selection annually. Include application-level events in audit scope.',
    framework: 'sp80053',
    function_category: 'Audit and Accountability',
    family: 'Audit and Accountability',
    related_controls: ['AU-3', 'AU-9', 'AU-12', 'SI-4'],
    tags: ['logging', 'audit-events', 'SIEM', 'monitoring', 'accountability'],
  },
  {
    control_id: 'AU-9',
    title: 'Audit Record Protection',
    description:
      'Protect audit information and audit tools from unauthorized access, modification, and deletion.',
    implementation_guidance:
      'Store audit logs in a centralized, access-controlled log management system separate from monitored systems. Implement write-once or append-only storage for audit logs. Restrict access to audit logs to authorized security personnel only. Use cryptographic hashing to detect log tampering. Back up audit logs to separate storage. Set retention period per regulatory requirements (typically 1-7 years).',
    framework: 'sp80053',
    function_category: 'Audit and Accountability',
    family: 'Audit and Accountability',
    related_controls: ['AU-2', 'AU-4', 'AC-3', 'MP-2'],
    tags: ['audit-protection', 'log-integrity', 'retention', 'tamper-proof'],
  },
  // ============================================================
  // NIST SP 800-53 Rev 5 — CONFIGURATION MANAGEMENT (CM)
  // ============================================================
  {
    control_id: 'CM-1',
    title: 'Configuration Management Policy and Procedures',
    description:
      'Develop, document, and disseminate a configuration management policy that addresses purpose, scope, roles, responsibilities, management commitment, coordination, and compliance.',
    implementation_guidance:
      'Create a Configuration Management Policy covering baseline configuration requirements, change control procedures, and configuration monitoring. Align with CIS Benchmarks or DISA STIGs for specific platforms. Define configuration management roles (CCB members, system owners). Review policy annually.',
    framework: 'sp80053',
    function_category: 'Configuration Management',
    family: 'Configuration Management',
    related_controls: ['CM-2', 'CM-3', 'CM-6'],
    tags: ['configuration-management', 'baselines', 'policy', 'CIS', 'STIG'],
  },
  {
    control_id: 'CM-2',
    title: 'Baseline Configuration',
    description:
      'Develop, document, and maintain under configuration control, a current baseline configuration of the system.',
    implementation_guidance:
      'Define and document security baseline configurations for all system types (servers, workstations, network devices, containers). Use CIS Benchmarks, DISA STIGs, or vendor hardening guides. Implement configuration management tools (Ansible, Chef, Puppet) to enforce and monitor baselines. Review baselines at least annually and after major system changes.',
    framework: 'sp80053',
    function_category: 'Configuration Management',
    family: 'Configuration Management',
    related_controls: ['CM-1', 'CM-3', 'CM-6', 'CM-8'],
    tags: ['baseline', 'hardening', 'CIS-benchmarks', 'configuration', 'automation'],
  },
  {
    control_id: 'CM-6',
    title: 'Configuration Settings',
    description:
      'Establish and document configuration settings for technology products employed within the system that reflect the most restrictive mode consistent with operational requirements.',
    implementation_guidance:
      'Apply security-focused configuration settings including disabling unnecessary services, closing unused ports, removing default accounts, and enabling security features. Use automated compliance scanning tools (Tenable Nessus, Qualys) to verify configuration settings. Document approved deviations with compensating controls. Track configuration drift and alert on unauthorized changes.',
    framework: 'sp80053',
    function_category: 'Configuration Management',
    family: 'Configuration Management',
    related_controls: ['CM-2', 'CM-7', 'SI-2', 'SA-11'],
    tags: ['configuration', 'hardening', 'least-functionality', 'compliance-scanning'],
  },
  // ============================================================
  // NIST SP 800-53 Rev 5 — INCIDENT RESPONSE (IR)
  // ============================================================
  {
    control_id: 'IR-1',
    title: 'Incident Response Policy and Procedures',
    description:
      'Develop, document, and disseminate an incident response policy that addresses purpose, scope, roles, responsibilities, management commitment, coordination, and compliance.',
    implementation_guidance:
      'Develop a formal Incident Response Policy approved by senior management. Define incident classification taxonomy (P1-P4 severity levels). Establish roles: CISO, IR Team Lead, Forensics, Legal, Communications. Include regulatory notification obligations. Distribute to all relevant personnel and review annually.',
    framework: 'sp80053',
    function_category: 'Incident Response',
    family: 'Incident Response',
    related_controls: ['IR-2', 'IR-4', 'IR-8'],
    tags: ['incident-response', 'policy', 'severity-levels', 'IRT'],
  },
  {
    control_id: 'IR-4',
    title: 'Incident Handling',
    description:
      'Implement an incident handling capability for security incidents that includes preparation, detection, analysis, containment, eradication, and recovery.',
    implementation_guidance:
      'Implement all phases of NIST incident response lifecycle: Preparation, Detection & Analysis, Containment/Eradication/Recovery, and Post-Incident Activity. Develop playbooks for common incident types (ransomware, phishing, DDoS, insider threat, data breach). Integrate with SOAR platform for automated response actions. Test handling procedures through regular exercises.',
    framework: 'sp80053',
    function_category: 'Incident Response',
    family: 'Incident Response',
    related_controls: ['IR-1', 'IR-2', 'IR-5', 'IR-8'],
    tags: ['incident-handling', 'SOAR', 'playbooks', 'containment', 'lifecycle'],
  },
  {
    control_id: 'IR-6',
    title: 'Incident Reporting',
    description:
      'Require personnel to report suspected incidents to the organizational incident response capability.',
    implementation_guidance:
      'Establish clear, easy-to-use incident reporting channels (email, phone hotline, ticketing system, SIEM alert). Train all employees annually on recognizing and reporting security incidents. Define what constitutes a reportable incident with examples. Implement a "see something, say something" culture. Track and acknowledge all reports within 4 hours. Protect reporters from retaliation.',
    framework: 'sp80053',
    function_category: 'Incident Response',
    family: 'Incident Response',
    related_controls: ['IR-4', 'IR-5', 'SI-4'],
    tags: ['incident-reporting', 'employee-training', 'security-culture', 'escalation'],
  },
  // ============================================================
  // NIST SP 800-53 Rev 5 — IDENTIFICATION AND AUTHENTICATION (IA)
  // ============================================================
  {
    control_id: 'IA-2',
    title: 'Identification and Authentication (Organizational Users)',
    description:
      'Uniquely identify and authenticate organizational users and associate that unique identification with processes acting on behalf of those users.',
    implementation_guidance:
      'Require unique user IDs for all system access — no shared accounts. Implement multi-factor authentication (MFA) for all privileged access and all remote access. Enforce MFA for cloud service administration. Use phishing-resistant authenticators (FIDO2, PIV) for high-value systems. Maintain an authoritative identity source and integrate all systems via SSO.',
    framework: 'sp80053',
    function_category: 'Identification and Authentication',
    family: 'Identification and Authentication',
    related_controls: ['IA-3', 'IA-4', 'IA-5', 'AC-2'],
    tags: ['identification', 'authentication', 'MFA', 'SSO', 'FIDO2'],
  },
  {
    control_id: 'IA-5',
    title: 'Authenticator Management',
    description:
      'Manage system authenticators by verifying the identity of the individual, group, role, service, or device receiving the authenticator as part of initial authenticator distribution.',
    implementation_guidance:
      'Enforce minimum password length of 15+ characters for standard accounts, 20+ for privileged accounts. Check passwords against known-breached password databases (HIBP). Implement password managers organization-wide. Require authenticator replacement when compromise is suspected. Establish procedures for lost/stolen authenticator recovery. Use certificates for device authentication.',
    framework: 'sp80053',
    function_category: 'Identification and Authentication',
    family: 'Identification and Authentication',
    related_controls: ['IA-2', 'IA-4', 'IA-6', 'AC-2'],
    tags: ['passwords', 'authenticators', 'credentials', 'password-manager', 'PKI'],
  },
  {
    control_id: 'IA-8',
    title: 'Identification and Authentication (Non-Organizational Users)',
    description:
      'Uniquely identify and authenticate non-organizational users or processes acting on behalf of non-organizational users.',
    implementation_guidance:
      'Apply consistent identification and authentication controls to contractors, vendors, partners, and customers. Implement separate identity stores or federation for external users. Enforce MFA for all external access. Apply principle of least privilege to external accounts. Review and recertify external accounts quarterly. Terminate access immediately when no longer needed.',
    framework: 'sp80053',
    function_category: 'Identification and Authentication',
    family: 'Identification and Authentication',
    related_controls: ['IA-2', 'IA-4', 'IA-5', 'AC-2'],
    tags: ['external-users', 'contractors', 'vendors', 'federation', 'authentication'],
  },
  // ============================================================
  // NIST SP 800-53 Rev 5 — RISK ASSESSMENT (RA)
  // ============================================================
  {
    control_id: 'RA-3',
    title: 'Risk Assessment',
    description:
      'Assess the likelihood and magnitude of harm from unauthorized access, use, disclosure, disruption, modification, or destruction of the system, the information it processes, stores, or transmits, and any related information.',
    implementation_guidance:
      'Conduct formal risk assessments using NIST SP 800-30 methodology or equivalent (OCTAVE, ISO 27005). Identify threats, vulnerabilities, and likelihood/impact ratings. Produce risk register with residual risk levels after control application. Present results to senior management for risk acceptance decisions. Reassess annually and after significant changes.',
    framework: 'sp80053',
    function_category: 'Risk Assessment',
    family: 'Risk Assessment',
    related_controls: ['RA-2', 'RA-5', 'PM-9', 'ID.RA-01'],
    tags: ['risk-assessment', 'risk-register', 'NIST-800-30', 'threat-analysis'],
  },
  {
    control_id: 'RA-5',
    title: 'Vulnerability Monitoring and Scanning',
    description:
      'Monitor and scan for vulnerabilities in the system and hosted applications periodically and when new vulnerabilities potentially affecting the system are identified.',
    implementation_guidance:
      'Conduct credentialed vulnerability scans weekly for internet-facing systems and monthly for internal systems. Use industry-leading scanners (Tenable Nessus, Qualys, Rapid7). Prioritize patching using CVSS scores and CISA KEV catalog. Remediate critical vulnerabilities within 15 days, high within 30 days, medium within 90 days. Conduct application security scans (SAST, DAST) in CI/CD pipeline.',
    framework: 'sp80053',
    function_category: 'Risk Assessment',
    family: 'Risk Assessment',
    related_controls: ['RA-3', 'SI-2', 'CA-7', 'ID.RA-01'],
    tags: ['vulnerability-scanning', 'patching', 'CVSS', 'CISA-KEV', 'remediation'],
  },
  {
    control_id: 'RA-7',
    title: 'Risk Response',
    description:
      'Respond to findings from security assessments, monitoring, threat intelligence activities, and audits.',
    implementation_guidance:
      'Establish a risk treatment process with four options: Accept, Avoid, Transfer (insurance), Mitigate. Document risk treatment decisions with business justification. Track risk remediation through a ticketing system. Report unacceptable residual risks to leadership for acceptance. Review accepted risks annually to confirm they remain acceptable.',
    framework: 'sp80053',
    function_category: 'Risk Assessment',
    family: 'Risk Assessment',
    related_controls: ['RA-3', 'RA-5', 'PM-9'],
    tags: ['risk-response', 'risk-treatment', 'risk-acceptance', 'remediation'],
  },
  // ============================================================
  // NIST SP 800-53 Rev 5 — SYSTEM AND COMMUNICATIONS PROTECTION (SC)
  // ============================================================
  {
    control_id: 'SC-8',
    title: 'Transmission Confidentiality and Integrity',
    description:
      'Implement cryptographic mechanisms to prevent unauthorized disclosure of information and detect changes to information during transmission.',
    implementation_guidance:
      'Enforce TLS 1.2+ for all data in transit. Configure strict TLS with strong cipher suites (AES-256-GCM, ChaCha20-Poly1305). Implement HTTP Strict Transport Security (HSTS) with preloading. Use certificate transparency logs. Implement mutual TLS (mTLS) for service-to-service communication. Monitor for certificate expiration and automate renewal.',
    framework: 'sp80053',
    function_category: 'System and Communications Protection',
    family: 'System and Communications Protection',
    related_controls: ['SC-12', 'SC-28', 'AC-17', 'PR.DS-02'],
    tags: ['TLS', 'encryption', 'data-in-transit', 'HSTS', 'mTLS', 'certificates'],
  },
  {
    control_id: 'SC-28',
    title: 'Protection of Information at Rest',
    description:
      'Implement cryptographic mechanisms to prevent unauthorized disclosure and modification of the information at rest on system components.',
    implementation_guidance:
      'Encrypt all data at rest using AES-256 encryption. Implement transparent data encryption (TDE) for databases. Use BitLocker or FileVault for endpoint encryption. Encrypt cloud storage buckets by default with customer-managed keys (CMK). Implement Key Management Service (KMS) with hardware security modules (HSM). Rotate encryption keys annually.',
    framework: 'sp80053',
    function_category: 'System and Communications Protection',
    family: 'System and Communications Protection',
    related_controls: ['SC-8', 'SC-12', 'MP-4', 'PR.DS-01'],
    tags: ['encryption', 'data-at-rest', 'AES-256', 'TDE', 'KMS', 'HSM'],
  },
  {
    control_id: 'SC-7',
    title: 'Boundary Protection',
    description:
      'Monitor and control communications at the external boundary of the system and at key internal boundaries within the system.',
    implementation_guidance:
      'Deploy next-generation firewalls (NGFW) at network perimeters with application-layer inspection. Implement demilitarized zones (DMZ) for internet-facing services. Use microsegmentation to limit lateral movement. Deploy web application firewalls (WAF) for internet-facing applications. Implement SD-WAN with security inspection for branch office connectivity.',
    framework: 'sp80053',
    function_category: 'System and Communications Protection',
    family: 'System and Communications Protection',
    related_controls: ['SC-5', 'SC-8', 'AC-4', 'PR.IR-01'],
    tags: ['boundary-protection', 'firewall', 'DMZ', 'microsegmentation', 'WAF'],
  },
  // ============================================================
  // NIST SP 800-53 Rev 5 — SYSTEM AND INFORMATION INTEGRITY (SI)
  // ============================================================
  {
    control_id: 'SI-2',
    title: 'Flaw Remediation',
    description:
      'Identify, report, and correct information system flaws; test software updates before installation; incorporate security patches into the organizational configuration management process.',
    implementation_guidance:
      'Establish a vulnerability management program with defined remediation SLAs: Critical 15 days, High 30 days, Medium 90 days, Low 180 days. Use automated patch management tools (WSUS, SCCM, Ansible). Test patches in non-production environments before deployment. Implement emergency patching procedures for actively exploited vulnerabilities (CISA KEV). Track patch compliance with dashboards.',
    framework: 'sp80053',
    function_category: 'System and Information Integrity',
    family: 'System and Information Integrity',
    related_controls: ['RA-5', 'CM-2', 'SA-10', 'ID.RA-01'],
    tags: ['patching', 'vulnerability-remediation', 'patch-management', 'SLA', 'CISA-KEV'],
  },
  {
    control_id: 'SI-3',
    title: 'Malicious Code Protection',
    description:
      'Implement malicious code protection mechanisms at system entry and exit points to detect and eradicate malicious code.',
    implementation_guidance:
      'Deploy enterprise anti-malware and EDR solutions on all endpoints and servers. Configure real-time scanning with automatic signature updates. Implement email security gateways with attachment sandboxing. Use DNS filtering to block known malicious domains. Enable memory protection (ASLR, DEP) on all systems. Conduct regular malware scanning of file shares.',
    framework: 'sp80053',
    function_category: 'System and Information Integrity',
    family: 'System and Information Integrity',
    related_controls: ['SI-2', 'SI-4', 'SC-26', 'DE.CM-09'],
    tags: ['anti-malware', 'EDR', 'malware-protection', 'endpoint-security', 'sandboxing'],
  },
  {
    control_id: 'SI-4',
    title: 'System Monitoring',
    description:
      'Monitor the system to detect attacks and indicators of potential attacks in accordance with monitoring objectives.',
    implementation_guidance:
      'Deploy SIEM with correlation rules for attack patterns and insider threats. Implement UEBA (User and Entity Behavior Analytics) to detect anomalous behavior. Monitor privileged user activity with PAM session recording. Deploy deception technologies (honeypots) to detect lateral movement. Create monitoring dashboards for security operations. Define and meet alerting SLAs.',
    framework: 'sp80053',
    function_category: 'System and Information Integrity',
    family: 'System and Information Integrity',
    related_controls: ['AU-2', 'AU-12', 'DE.CM-01', 'SI-3'],
    tags: ['monitoring', 'SIEM', 'UEBA', 'PAM', 'honeypots', 'SOC'],
  },
  // ============================================================
  // NIST SP 800-53 Rev 5 — PLANNING (PL)
  // ============================================================
  {
    control_id: 'PL-2',
    title: 'System Security and Privacy Plans',
    description:
      'Develop, document, and update security and privacy plans for the system that describe the security and privacy requirements and the controls in place or planned for meeting those requirements.',
    implementation_guidance:
      'Develop System Security Plans (SSP) for all systems based on their security categorization (FIPS 199). Include system boundary, interconnections, data flows, and all applicable controls with implementation descriptions. Review and update SSPs annually and after major changes. Obtain authorizing official (AO) review for high-impact systems.',
    framework: 'sp80053',
    function_category: 'Planning',
    family: 'Planning',
    related_controls: ['PL-8', 'CA-3', 'PM-1'],
    tags: ['system-security-plan', 'SSP', 'documentation', 'authorization', 'FISMA'],
  },
  {
    control_id: 'PL-8',
    title: 'Security and Privacy Architectures',
    description:
      'Develop security and privacy architectures for the system that describe how to implement applicable security and privacy requirements and controls throughout the system development life cycle.',
    implementation_guidance:
      'Document the security architecture including network diagrams, data flow diagrams, trust boundaries, and control mapping. Adopt security-by-design principles from system inception. Use threat modeling (STRIDE, PASTA) to identify architectural risks. Review architecture with a security architect for every major system change. Align architecture with Zero Trust principles.',
    framework: 'sp80053',
    function_category: 'Planning',
    family: 'Planning',
    related_controls: ['PL-2', 'SA-8', 'SR-3'],
    tags: ['security-architecture', 'threat-modeling', 'zero-trust', 'STRIDE', 'design'],
  },
  {
    control_id: 'PL-10',
    title: 'Baseline Selection',
    description:
      'Select a control baseline for the system.',
    implementation_guidance:
      'Categorize the information system using FIPS 199 based on confidentiality, integrity, and availability impact levels. Select the corresponding NIST SP 800-53 control baseline (Low, Moderate, High). Document the security categorization and baseline selection in the SSP. Have the categorization reviewed by the data owner and authorizing official.',
    framework: 'sp80053',
    function_category: 'Planning',
    family: 'Planning',
    related_controls: ['PL-2', 'RA-2', 'SA-8'],
    tags: ['FIPS-199', 'control-baseline', 'security-categorization', 'risk-management'],
  },
  // ============================================================
  // NIST SP 800-171 — ACCESS CONTROL
  // ============================================================
  {
    control_id: '3.1.1',
    title: 'Authorized Access Control',
    description:
      'Limit system access to authorized users, processes acting on behalf of authorized users, and devices (including other systems).',
    implementation_guidance:
      'Implement access control mechanisms that authenticate and authorize all system access. Deploy identity and access management (IAM) solutions with role-based access control. Maintain an up-to-date list of authorized users. Remove access immediately upon employee separation. Implement session management with automatic timeouts. For CUI systems, apply enhanced scrutiny to all access requests.',
    framework: 'sp800171',
    function_category: 'Access Control',
    family: 'Access Control',
    related_controls: ['3.1.2', '3.1.3', '3.5.1'],
    tags: ['access-control', 'authorization', 'CUI', 'CMMC', 'least-privilege'],
  },
  {
    control_id: '3.1.2',
    title: 'Transaction and Function Control',
    description:
      'Limit system access to the types of transactions and functions that authorized users are permitted to execute.',
    implementation_guidance:
      'Implement application-level access controls restricting functions based on user roles. Use role-based access control (RBAC) with granular permissions. Prevent users from accessing functions not required for their job duties. Implement separation of duties for critical transactions. Log all privileged function executions.',
    framework: 'sp800171',
    function_category: 'Access Control',
    family: 'Access Control',
    related_controls: ['3.1.1', '3.1.3', '3.1.6'],
    tags: ['transaction-control', 'RBAC', 'separation-of-duties', 'CUI', 'least-privilege'],
  },
  {
    control_id: '3.1.3',
    title: 'Control CUI Flow',
    description:
      'Control the flow of CUI in accordance with approved authorizations.',
    implementation_guidance:
      'Implement data loss prevention (DLP) solutions to monitor and control CUI flows. Define authorized CUI handling procedures and approved transmission channels. Encrypt CUI before transmission. Block unauthorized transfer of CUI to removable media. Monitor email and cloud storage for unauthorized CUI sharing. Train users on approved CUI handling methods.',
    framework: 'sp800171',
    function_category: 'Access Control',
    family: 'Access Control',
    related_controls: ['3.1.1', '3.1.2', '3.13.8'],
    tags: ['CUI', 'data-flow', 'DLP', 'DFARS', 'information-flow'],
  },
  // ============================================================
  // NIST SP 800-171 — AUDIT AND ACCOUNTABILITY
  // ============================================================
  {
    control_id: '3.3.1',
    title: 'System Auditing',
    description:
      'Create and retain system audit logs and records to the extent needed to enable the monitoring, analysis, investigation, and reporting of unlawful or unauthorized system activity.',
    implementation_guidance:
      'Enable comprehensive audit logging on all systems processing CUI. Log authentication events, privilege use, file access, and configuration changes. Retain audit logs for at least 3 years per DFARS requirements. Protect log integrity using write-once storage or cryptographic verification. Store logs in a centralized SIEM separate from production systems.',
    framework: 'sp800171',
    function_category: 'Audit and Accountability',
    family: 'Audit and Accountability',
    related_controls: ['3.3.2', '3.3.3', '3.14.6'],
    tags: ['audit-logging', 'CUI', 'DFARS', 'CMMC', 'log-retention'],
  },
  {
    control_id: '3.3.2',
    title: 'Audit Log Review',
    description:
      'Ensure that the actions of individual system users can be uniquely traced to those users so they can be held accountable for their actions.',
    implementation_guidance:
      'Assign unique user IDs to all system users — prohibit shared accounts. Ensure all audit records include user ID, timestamp, and action performed. Conduct regular review of audit logs for anomalous activity. Implement automated log analysis to flag suspicious patterns. Maintain audit trail linking actions to specific individuals for non-repudiation.',
    framework: 'sp800171',
    function_category: 'Audit and Accountability',
    family: 'Audit and Accountability',
    related_controls: ['3.3.1', '3.5.1', '3.5.2'],
    tags: ['user-traceability', 'non-repudiation', 'accountability', 'CUI', 'audit'],
  },
  {
    control_id: '3.3.5',
    title: 'Audit Correlation and Review',
    description:
      'Correlate audit record review, analysis, and reporting processes for investigation and response to indications of unlawful, unauthorized, suspicious, or unusual activity.',
    implementation_guidance:
      'Deploy SIEM to correlate log events across multiple systems. Create correlation rules for common attack patterns. Conduct regular threat hunting using audit data. Generate weekly security reports summarizing audit findings. Integrate audit analysis with incident response procedures. Establish escalation procedures for detected anomalies.',
    framework: 'sp800171',
    function_category: 'Audit and Accountability',
    family: 'Audit and Accountability',
    related_controls: ['3.3.1', '3.3.2', '3.14.6'],
    tags: ['log-correlation', 'SIEM', 'threat-hunting', 'CUI', 'incident-detection'],
  },
  // ============================================================
  // NIST SP 800-171 — CONFIGURATION MANAGEMENT
  // ============================================================
  {
    control_id: '3.4.1',
    title: 'Baseline Configurations',
    description:
      'Establish and maintain baseline configurations and inventories of organizational systems (including hardware, software, firmware, and documentation) throughout the respective system development life cycles.',
    implementation_guidance:
      'Document baseline security configurations for all systems processing CUI using CIS Benchmarks or DISA STIGs. Maintain a current system inventory including hardware, software, firmware versions. Use configuration management tools to enforce and validate baselines. Review baselines annually and update after significant changes or new vulnerability discoveries.',
    framework: 'sp800171',
    function_category: 'Configuration Management',
    family: 'Configuration Management',
    related_controls: ['3.4.2', '3.4.3', '3.4.6'],
    tags: ['baseline', 'configuration', 'inventory', 'CUI', 'CIS-benchmarks', 'CMMC'],
  },
  {
    control_id: '3.4.2',
    title: 'Security Configuration Enforcement',
    description:
      'Establish and enforce security configuration settings for information technology products employed in organizational systems.',
    implementation_guidance:
      'Implement security configuration baselines using group policy objects (GPO), MDM solutions (Intune, Jamf), or configuration management tools. Disable unnecessary services, close unused ports, remove default credentials. Monitor for configuration drift and automatically remediate deviations. Document approved configuration exceptions with compensating controls and management sign-off.',
    framework: 'sp800171',
    function_category: 'Configuration Management',
    family: 'Configuration Management',
    related_controls: ['3.4.1', '3.4.3', '3.4.7'],
    tags: ['configuration-enforcement', 'GPO', 'MDM', 'hardening', 'CUI'],
  },
  {
    control_id: '3.4.6',
    title: 'Least Functionality',
    description:
      'Employ the principle of least functionality by configuring organizational systems to provide only essential capabilities.',
    implementation_guidance:
      'Disable all unnecessary services, applications, and functions on systems processing CUI. Implement application whitelisting to prevent unauthorized software execution. Remove default applications and features that are not required for business operations. Conduct regular reviews to identify and remove unnecessary functionality. Document the rationale for each enabled service.',
    framework: 'sp800171',
    function_category: 'Configuration Management',
    family: 'Configuration Management',
    related_controls: ['3.4.1', '3.4.2', '3.1.1'],
    tags: ['least-functionality', 'whitelisting', 'hardening', 'CUI', 'CMMC'],
  },
  // ============================================================
  // NIST SP 800-171 — IDENTIFICATION AND AUTHENTICATION
  // ============================================================
  {
    control_id: '3.5.1',
    title: 'User Identification',
    description:
      'Identify system users, processes acting on behalf of users, and devices.',
    implementation_guidance:
      'Assign unique identifiers to all users, service accounts, and devices accessing CUI systems. Prohibit shared or group accounts on CUI systems. Maintain an authoritative identity source (directory service). Register all devices in an asset management system. Implement device certificates for machine authentication.',
    framework: 'sp800171',
    function_category: 'Identification and Authentication',
    family: 'Identification and Authentication',
    related_controls: ['3.5.2', '3.5.3', '3.1.1'],
    tags: ['identification', 'unique-identifiers', 'CUI', 'CMMC', 'device-identity'],
  },
  {
    control_id: '3.5.2',
    title: 'User Authentication',
    description:
      'Authenticate (or verify) the identities of those users, processes, or devices, as a prerequisite to allowing access to organizational systems.',
    implementation_guidance:
      'Implement strong authentication for all CUI system access. Require MFA for all network access to CUI systems (CMMC Level 2 requirement). Use PIV/CAC cards or FIDO2 authenticators for privileged access. Configure authentication timeouts and lockout policies (5 failed attempts). Implement SSO to reduce password fatigue while maintaining strong authentication.',
    framework: 'sp800171',
    function_category: 'Identification and Authentication',
    family: 'Identification and Authentication',
    related_controls: ['3.5.1', '3.5.3', '3.5.4'],
    tags: ['authentication', 'MFA', 'PIV', 'CMMC', 'CUI', 'strong-authentication'],
  },
  {
    control_id: '3.5.3',
    title: 'Multi-Factor Authentication',
    description:
      'Use multifactor authentication for local and network access to privileged accounts and for network access to non-privileged accounts.',
    implementation_guidance:
      'Deploy MFA solutions (Duo, Microsoft Authenticator, Okta) for all network and remote access. Require MFA for all privileged account access including local administrative access. Implement MFA for cloud service administration. Evaluate and deploy phishing-resistant MFA (FIDO2) for high-risk access scenarios. Document MFA exceptions with compensating controls.',
    framework: 'sp800171',
    function_category: 'Identification and Authentication',
    family: 'Identification and Authentication',
    related_controls: ['3.5.1', '3.5.2', '3.1.1'],
    tags: ['MFA', 'multi-factor', 'privileged-access', 'CUI', 'CMMC-Level2'],
  },
  // ============================================================
  // NIST SP 800-171 — INCIDENT RESPONSE
  // ============================================================
  {
    control_id: '3.6.1',
    title: 'Incident Response Capability',
    description:
      'Establish an operational incident-handling capability for organizational systems that includes preparation, detection, analysis, containment, recovery, and user response activities.',
    implementation_guidance:
      'Develop and document incident response procedures covering all phases for CUI-related incidents. Create incident response playbooks for scenarios likely to affect CUI (data theft, ransomware, insider threat). Train IR team and conduct quarterly tabletop exercises. Maintain 24/7 incident response contact list. Establish relationships with CISA and FBI for significant incidents.',
    framework: 'sp800171',
    function_category: 'Incident Response',
    family: 'Incident Response',
    related_controls: ['3.6.2', '3.6.3', '3.14.6'],
    tags: ['incident-response', 'CUI', 'CMMC', 'playbooks', 'preparation'],
  },
  {
    control_id: '3.6.2',
    title: 'Incident Reporting to DIBNet',
    description:
      'Track, document, and report incidents to designated officials and/or authorities both internal and external to the organization.',
    implementation_guidance:
      'Establish incident tracking in a ticketing system with required fields (incident type, affected systems, CUI involved, timeline, actions taken). Report cyber incidents affecting CUI to DoD/DCSA within 72 hours via DIBNet portal (for defense contractors). Maintain incident records for 3 years. Conduct post-incident reviews and update procedures based on lessons learned.',
    framework: 'sp800171',
    function_category: 'Incident Response',
    family: 'Incident Response',
    related_controls: ['3.6.1', '3.6.3'],
    tags: ['incident-reporting', 'DIBNet', 'DoD', 'DFARS', 'CUI', 'CMMC'],
  },
  {
    control_id: '3.6.3',
    title: 'Incident Response Testing',
    description:
      'Test the organizational incident response capability.',
    implementation_guidance:
      'Conduct annual incident response exercises including tabletop exercises and full simulation exercises. Test specific scenarios relevant to CUI protection (data breach, insider threat, ransomware). Measure metrics: detection time, response time, containment time, recovery time. Document exercise results and update IR plans based on findings. Include legal, compliance, and communications teams in exercises.',
    framework: 'sp800171',
    function_category: 'Incident Response',
    family: 'Incident Response',
    related_controls: ['3.6.1', '3.6.2'],
    tags: ['IR-testing', 'tabletop', 'exercises', 'CUI', 'CMMC'],
  },
];
