-- Security Constraints and Data Protection
-- IEEE 829 Security Testing Requirements by Tester-Reviewer Agent

-- Email validation constraint
CREATE TRIGGER validate_email_format
BEFORE INSERT ON team_members
FOR EACH ROW
BEGIN
  SELECT CASE
    WHEN NEW.email NOT LIKE '%@%.%' THEN
      RAISE(ABORT, 'Invalid email format')
  END;
END;

-- Status enum validation for team members
CREATE TRIGGER validate_team_member_status
BEFORE INSERT ON team_members
FOR EACH ROW
BEGIN
  SELECT CASE
    WHEN NEW.status NOT IN ('active', 'inactive', 'suspended') THEN
      RAISE(ABORT, 'Invalid team member status')
  END;
END;

-- Role enum validation for team members
CREATE TRIGGER validate_team_member_role
BEFORE INSERT ON team_members
FOR EACH ROW
BEGIN
  SELECT CASE
    WHEN NEW.role NOT IN ('architect-engineer', 'tester-reviewer', 'optimizer-watchdog', 'scrum-knowledge', 'morale-catalyst', 'technical-enablement', 'standup-facilitator') THEN
      RAISE(ABORT, 'Invalid team member role')
  END;
END;

-- Project status validation
CREATE TRIGGER validate_project_status
BEFORE INSERT ON projects
FOR EACH ROW
BEGIN
  SELECT CASE
    WHEN NEW.status NOT IN ('planning', 'active', 'on-hold', 'completed', 'cancelled') THEN
      RAISE(ABORT, 'Invalid project status')
  END;
END;

-- Priority validation
CREATE TRIGGER validate_project_priority
BEFORE INSERT ON projects
FOR EACH ROW
BEGIN
  SELECT CASE
    WHEN NEW.priority NOT IN ('low', 'medium', 'high', 'critical') THEN
      RAISE(ABORT, 'Invalid project priority')
  END;
END;

-- Agent session status validation
CREATE TRIGGER validate_agent_session_status
BEFORE INSERT ON agent_sessions
FOR EACH ROW
BEGIN
  SELECT CASE
    WHEN NEW.status NOT IN ('active', 'completed', 'failed', 'handoff') THEN
      RAISE(ABORT, 'Invalid agent session status')
  END;
END;

-- Loop count validation (CRITICAL for agent workflow)
CREATE TRIGGER validate_loop_count
BEFORE UPDATE ON agent_sessions
FOR EACH ROW
BEGIN
  SELECT CASE
    WHEN NEW.loop_count > 2 THEN
      RAISE(ABORT, 'Loop count exceeded maximum of 2 - escalation required')
  END;
END;

-- Security level validation for audit logs
CREATE TRIGGER validate_security_level
BEFORE INSERT ON audit_logs
FOR EACH ROW
BEGIN
  SELECT CASE
    WHEN NEW.security_level NOT IN ('low', 'standard', 'high', 'critical') THEN
      RAISE(ABORT, 'Invalid security level')
  END;
END;

-- Metric type validation
CREATE TRIGGER validate_metric_type
BEFORE INSERT ON enterprise_metrics
FOR EACH ROW
BEGIN
  SELECT CASE
    WHEN NEW.metric_type NOT IN ('roi', 'performance', 'quality', 'efficiency', 'satisfaction') THEN
      RAISE(ABORT, 'Invalid metric type')
  END;
END;

-- Percentage validation for various fields
CREATE TRIGGER validate_percentages
BEFORE INSERT ON team_members
FOR EACH ROW
BEGIN
  SELECT CASE
    WHEN NEW.autonomy_level < 0 OR NEW.autonomy_level > 100 THEN
      RAISE(ABORT, 'Autonomy level must be between 0 and 100')
    WHEN NEW.risk_tolerance < 0 OR NEW.risk_tolerance > 100 THEN
      RAISE(ABORT, 'Risk tolerance must be between 0 and 100')
    WHEN NEW.creativity < 0 OR NEW.creativity > 100 THEN
      RAISE(ABORT, 'Creativity must be between 0 and 100')
    WHEN NEW.precision < 0 OR NEW.precision > 100 THEN
      RAISE(ABORT, 'Precision must be between 0 and 100')
    WHEN NEW.collaboration < 0 OR NEW.collaboration > 100 THEN
      RAISE(ABORT, 'Collaboration must be between 0 and 100')
    WHEN NEW.quality_score < 0 OR NEW.quality_score > 100 THEN
      RAISE(ABORT, 'Quality score must be between 0 and 100')
  END;
END;

-- Date validation for projects
CREATE TRIGGER validate_project_dates
BEFORE INSERT ON projects
FOR EACH ROW
BEGIN
  SELECT CASE
    WHEN NEW.start_date IS NOT NULL AND NEW.end_date IS NOT NULL 
         AND NEW.end_date < NEW.start_date THEN
      RAISE(ABORT, 'End date cannot be before start date')
  END;
END;

-- Progress validation for projects
CREATE TRIGGER validate_project_progress
BEFORE UPDATE ON projects
FOR EACH ROW
BEGIN
  SELECT CASE
    WHEN NEW.progress < 0 OR NEW.progress > 100 THEN
      RAISE(ABORT, 'Progress must be between 0 and 100')
    WHEN NEW.tasks_completed > NEW.tasks_total THEN
      RAISE(ABORT, 'Completed tasks cannot exceed total tasks')
  END;
END;