# Claude Workflow Prompts - Aurorion Teams Documentation Generation
*Reusable prompt structures for comprehensive project documentation*

## 🎯 **Master Prompt: Top-to-Bottom Project Overview**

### **Primary Prompt Structure**

```xml
<workflow_request>
  <objective>Create comprehensive top-to-bottom project documentation</objective>
  <scope>Complete system analysis from architecture to deployment</scope>
  
  <team_coordination>
    <agents>
      <agent role="standup-facilitator" responsibility="coordinate_overview_documentation"/>
      <agent role="architect-engineer" responsibility="system_architecture_technical_stack"/>
      <agent role="technical-enablement" responsibility="development_workflow_environment_setup"/>
      <agent role="tester-reviewer" responsibility="testing_strategy_quality_assurance"/>
      <agent role="optimizer-watchdog" responsibility="performance_deployment_readiness"/>
      <agent role="scrum-knowledge" responsibility="compile_comprehensive_overview"/>
    </agents>
    
    <handoff_protocol>sequential_expertise_building</handoff_protocol>
    <documentation_standards>IEEE_829_ISTQB_PMBOK</documentation_standards>
  </team_coordination>
  
  <deliverables>
    <primary>PROJECT_OVERVIEW.md</primary>
    <integration>teams_documentation_system</integration>
    <database_update>current_progress_tracking</database_update>
    <workflow_capture>claude_prompt_structures</workflow_capture>
  </deliverables>
  
  <output_requirements>
    <format>comprehensive_markdown</format>
    <sections>
      - project_summary
      - system_architecture  
      - core_features
      - development_workflow
      - testing_quality_assurance
      - performance_optimization
      - deployment_infrastructure
      - security_compliance
      - documentation_knowledge_management
      - roadmap_next_steps
      - success_metrics
      - contributing_guidelines
    </sections>
  </output_requirements>
</workflow_request>
```

### **JSON Version**

```json
{
  "workflow_request": {
    "objective": "Create comprehensive top-to-bottom project documentation",
    "scope": "Complete system analysis from architecture to deployment",
    
    "team_coordination": {
      "agents": [
        {
          "role": "standup-facilitator",
          "responsibility": "coordinate_overview_documentation"
        },
        {
          "role": "architect-engineer", 
          "responsibility": "system_architecture_technical_stack"
        },
        {
          "role": "technical-enablement",
          "responsibility": "development_workflow_environment_setup"
        },
        {
          "role": "tester-reviewer",
          "responsibility": "testing_strategy_quality_assurance"
        },
        {
          "role": "optimizer-watchdog",
          "responsibility": "performance_deployment_readiness"
        },
        {
          "role": "scrum-knowledge",
          "responsibility": "compile_comprehensive_overview"
        }
      ],
      "handoff_protocol": "sequential_expertise_building",
      "documentation_standards": ["IEEE_829", "ISTQB", "PMBOK"]
    },
    
    "deliverables": {
      "primary": "PROJECT_OVERVIEW.md",
      "integration": "teams_documentation_system",
      "database_update": "current_progress_tracking", 
      "workflow_capture": "claude_prompt_structures"
    },
    
    "output_requirements": {
      "format": "comprehensive_markdown",
      "sections": [
        "project_summary",
        "system_architecture",
        "core_features", 
        "development_workflow",
        "testing_quality_assurance",
        "performance_optimization",
        "deployment_infrastructure",
        "security_compliance",
        "documentation_knowledge_management",
        "roadmap_next_steps",
        "success_metrics",
        "contributing_guidelines"
      ]
    }
  }
}
```

## 🔄 **Workflow Trigger Prompts**

### **1. Comprehensive Cleanup & Documentation Sprint**

```xml
<sprint_request>
  <type>comprehensive_cleanup_documentation</type>
  <objectives>
    - resolve_critical_system_issues
    - optimize_development_environment
    - create_comprehensive_documentation
    - enhance_testing_framework
    - establish_quality_standards
  </objectives>
  
  <team_approach>full_scrum_cross_agent_collaboration</team_approach>
  <methodology>agile_pmbok_industry_standards</methodology>
  <deliverables>production_ready_documentation_enhanced_workflow</deliverables>
</sprint_request>
```

### **2. Authentication System Analysis & Fix**

```xml
<technical_analysis>
  <focus>webauthn_passkey_authentication</focus>
  <problem>authentication_button_non_responsive</problem>
  <approach>systematic_root_cause_analysis</approach>
  
  <agent_sequence>
    <step>architect_engineer_system_analysis</step>
    <step>technical_enablement_environment_validation</step>
    <step>tester_reviewer_functionality_testing</step>
    <step>optimizer_watchdog_performance_assessment</step>
  </agent_sequence>
</technical_analysis>
```

### **3. Development Environment Optimization**

```xml
<environment_optimization>
  <goal>proxy_first_development_workflow</goal>
  <requirements>
    - eliminate_localhost_dependencies
    - standardize_development_urls
    - optimize_port_configuration
    - enhance_development_scripts
  </requirements>
  
  <configuration_targets>
    - astro_config_optimization
    - playwright_test_configuration
    - webauthn_environment_alignment
    - database_connection_standardization
  </configuration_targets>
</environment_optimization>
```

## 📋 **Agent-Specific Prompt Templates**

### **Standup Facilitator Coordination**

```xml
<coordination_request>
  <role>standup-facilitator</role>
  <task>coordinate_team_scrum</task>
  
  <coordination_pattern>
    <phase>initiation</phase>
    <activities>
      - assess_team_status
      - create_todo_structure  
      - establish_sprint_objectives
      - coordinate_agent_handoffs
    </activities>
  </coordination_pattern>
  
  <success_criteria>
    - clear_objective_definition
    - efficient_agent_coordination
    - progress_tracking_established
    - deliverable_structure_defined
  </success_criteria>
</coordination_request>
```

### **Architect-Engineer Analysis**

```xml
<architecture_analysis>
  <role>architect-engineer</role>
  <focus>system_architecture_technical_implementation</focus>
  
  <analysis_scope>
    <technology_stack>comprehensive_review</technology_stack>
    <database_schema>structure_relationships_optimization</database_schema>
    <api_endpoints>implementation_patterns_security</api_endpoints>
    <configuration>environment_deployment_optimization</configuration>
  </analysis_scope>
  
  <deliverables>
    - technical_architecture_documentation
    - implementation_recommendations
    - optimization_opportunities
    - integration_patterns
  </deliverables>
</architecture_analysis>
```

### **Technical Enablement Environment Setup**

```xml
<environment_enablement>
  <role>technical-enablement</role>
  <focus>development_workflow_optimization</focus>
  
  <enablement_areas>
    <development_environment>
      - script_optimization
      - dependency_management
      - configuration_standardization
      - workflow_automation
    </development_environment>
    
    <database_management>
      - schema_synchronization
      - seeding_procedures
      - migration_management
      - progress_tracking
    </database_management>
  </enablement_areas>
</environment_enablement>
```

### **Tester-Reviewer Quality Validation**

```xml
<quality_validation>
  <role>tester-reviewer</role>
  <standards>IEEE_829_ISTQB_ISO_25010</standards>
  
  <validation_scope>
    <testing_framework>
      - configuration_validation
      - coverage_assessment
      - automation_enhancement
      - quality_gates_establishment
    </testing_framework>
    
    <documentation_quality>
      - completeness_verification
      - standards_compliance
      - technical_accuracy
      - maintainability_assessment
    </documentation_quality>
  </validation_scope>
</quality_validation>
```

### **Optimizer-Watchdog Performance Assessment**

```xml
<performance_optimization>
  <role>optimizer-watchdog</role>
  <methodology>ITIL_DevOps_best_practices</methodology>
  
  <assessment_areas>
    <current_performance>
      - resource_utilization
      - build_performance
      - runtime_characteristics
      - deployment_readiness
    </current_performance>
    
    <optimization_opportunities>
      - bottleneck_identification
      - configuration_improvements
      - security_vulnerability_assessment
      - scalability_recommendations
    </optimization_opportunities>
  </assessment_areas>
</performance_optimization>
```

### **Scrum-Knowledge Documentation Compilation**

```xml
<knowledge_compilation>
  <role>scrum-knowledge</role>
  <methodology>PMBOK_Agile_knowledge_management</methodology>
  
  <compilation_process>
    <information_gathering>
      - cross_agent_expertise_synthesis
      - technical_details_consolidation
      - workflow_pattern_documentation
      - best_practices_capture
    </information_gathering>
    
    <documentation_creation>
      - comprehensive_overview_generation
      - structured_markdown_formatting
      - cross_reference_establishment
      - maintenance_procedures_definition
    </documentation_creation>
  </compilation_process>
</knowledge_compilation>
```

## 🎯 **Reusable Workflow Patterns**

### **Pattern 1: System Issue Resolution**

```xml
<system_issue_resolution>
  <trigger>critical_system_malfunction</trigger>
  <approach>systematic_root_cause_analysis</approach>
  
  <workflow>
    <phase name="analysis">
      <agents>architect_engineer</agents>
      <deliverable>technical_root_cause_identification</deliverable>
    </phase>
    
    <phase name="environment_validation">
      <agents>technical_enablement</agents>
      <deliverable>environment_configuration_verification</deliverable>
    </phase>
    
    <phase name="testing_validation">
      <agents>tester_reviewer</agents>
      <deliverable>functionality_verification_testing</deliverable>
    </phase>
    
    <phase name="optimization">
      <agents>optimizer_watchdog</agents>
      <deliverable>performance_security_assessment</deliverable>
    </phase>
    
    <phase name="documentation">
      <agents>scrum_knowledge</agents>
      <deliverable>comprehensive_resolution_documentation</deliverable>
    </phase>
  </workflow>
</system_issue_resolution>
```

### **Pattern 2: Feature Development Documentation**

```xml
<feature_documentation>
  <trigger>new_feature_implementation_complete</trigger>
  <objective>comprehensive_feature_documentation</objective>
  
  <documentation_aspects>
    <technical>architecture_implementation_details</technical>
    <functional>user_facing_capabilities_workflows</functional>
    <testing>quality_assurance_validation_procedures</testing>
    <operational>deployment_maintenance_procedures</operational>
  </documentation_aspects>
</feature_documentation>
```

### **Pattern 3: Environment Optimization**

```xml
<environment_optimization>
  <trigger>development_workflow_enhancement_needed</trigger>
  <focus>developer_experience_productivity</focus>
  
  <optimization_areas>
    <configuration>standardization_consistency</configuration>
    <automation>script_enhancement_workflow_automation</automation>
    <documentation>setup_procedures_troubleshooting_guides</documentation>
    <quality>testing_validation_procedures</quality>
  </optimization_areas>
</environment_optimization>
```

## 🔧 **Implementation Guidelines**

### **How to Use These Prompts**

1. **Select Appropriate Pattern**: Choose the workflow pattern that matches your objective
2. **Customize Parameters**: Adjust agent roles, deliverables, and scope as needed
3. **Execute Sequential Handoffs**: Follow the defined agent sequence for optimal results
4. **Validate Deliverables**: Ensure each phase produces the expected outputs
5. **Document Outcomes**: Capture results for future workflow improvements

### **Prompt Customization Variables**

```xml
<customization_variables>
  <project_context>
    <name>{PROJECT_NAME}</name>
    <technology_stack>{TECH_STACK}</technology_stack>
    <deployment_target>{DEPLOYMENT_PLATFORM}</deployment_target>
    <team_size>{AGENT_COUNT}</team_size>
  </project_context>
  
  <scope_modifiers>
    <depth>{ANALYSIS_DEPTH}</depth>
    <breadth>{COVERAGE_SCOPE}</breadth>
    <timeline>{COMPLETION_TIMELINE}</timeline>
    <priority>{PRIORITY_LEVEL}</priority>
  </scope_modifiers>
</customization_variables>
```

### **Success Metrics**

```xml
<success_metrics>
  <coordination_effectiveness>
    - handoff_efficiency
    - communication_clarity
    - deliverable_quality
    - timeline_adherence
  </coordination_effectiveness>
  
  <documentation_quality>
    - completeness_score
    - technical_accuracy
    - maintainability_rating
    - user_accessibility
  </documentation_quality>
  
  <workflow_efficiency>
    - time_to_completion
    - resource_utilization
    - error_reduction
    - knowledge_retention
  </workflow_efficiency>
</success_metrics>
```

---

## 🎉 **Usage Examples**

### **Example 1: Full Project Documentation**

```bash
# Trigger the master prompt for comprehensive documentation
> Create a top-to-bottom project overview using the full Aurorion Teams workflow
```

### **Example 2: Specific Issue Resolution**

```bash
# Use the system issue resolution pattern
> The authentication system is not working - coordinate full team analysis using the systematic resolution workflow
```

### **Example 3: Environment Optimization**

```bash
# Apply environment optimization pattern
> Optimize our development environment eliminating localhost dependencies and using our proxy setup
```

---

*Created: $(date)*  
*Version: 1.0*  
*Maintainer: Aurorion Teams Collective*  
*Usage: Copy and customize these prompt structures for consistent, high-quality team coordination and documentation generation*