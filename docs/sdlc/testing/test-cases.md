# Tests

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start summary -->
98 tests · Passed 32 · Failed 59 · Skipped 0 · Not run 7

Acceptance criteria covered: 28/39 · passing: 0/39
<!-- sdlc:auto:end summary -->

<!-- sdlc:auto:start tests -->
## Sprint 1

### US-001: Sign up with email and password

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-004 | test_ac004_hash_and_verify | Unit | Passed | `backend/tests/unit/test_security.py` |
| — | test_streak_ends_today_or_yesterday | Unit | Passed | `backend/tests/unit/test_security.py` |
| — | test_token_hash_is_deterministic_hex | Unit | Passed | `backend/tests/unit/test_security.py` |
| — | test_valid_timezone | Unit | Passed | `backend/tests/unit/test_security.py` |
| AC-019 | test_ac019_done_yesterday_not_today | Unit | Passed | `backend/tests/unit/test_streak.py` |
| AC-019 | test_ac019_streak_gap_resets | Unit | Passed | `backend/tests/unit/test_streak.py` |
| AC-019 | test_ac019_streak_many_days | Unit | Passed | `backend/tests/unit/test_streak.py` |
| AC-019 | test_ac019_streak_one_day | Unit | Passed | `backend/tests/unit/test_streak.py` |
| AC-019 | test_ac019_streak_zero | Unit | Passed | `backend/tests/unit/test_streak.py` |
| AC-009 | App > [AC-009] redirects /today to sign-in when there is no session token | Unit | Passed | `frontend/src/App.test.tsx` |
| — | App > renders a screen inside the app shell and shows its menu | Unit | Passed | `frontend/src/App.test.tsx` |
| AC-001 | auth screens > [AC-001] sign-up stores token, sends timezone and navigates | Unit | Passed | `frontend/src/screens/Auth.test.tsx` |
| AC-002 | auth screens > [AC-002] sign-up shows the 409 message and stays | Unit | Passed | `frontend/src/screens/Auth.test.tsx` |
| AC-003 | auth screens > [AC-003] sign-up maps a 422 to the email field | Unit | Passed | `frontend/src/screens/Auth.test.tsx` |
| AC-003 | auth screens > [AC-003] sign-up shows linked field errors for empty input | Unit | Passed | `frontend/src/screens/Auth.test.tsx` |
| AC-005 | auth screens > [AC-005] sign-in stores token and navigates | Unit | Passed | `frontend/src/screens/Auth.test.tsx` |
| AC-006 | auth screens > [AC-006] sign-in 401 shows one generic message | Unit | Passed | `frontend/src/screens/Auth.test.tsx` |
| AC-007 | Today > [AC-007] sign out calls the API and goes to sign-in | Unit | Passed | `frontend/src/screens/Today.test.tsx` |
| AC-008 | Today > [AC-008] a failed 401 renders no habit data | Unit | Passed | `frontend/src/screens/Today.test.tsx` |
| AC-019 | Today > [AC-019] lists habits with done state and streak, one GET /habits | Unit | Passed | `frontend/src/screens/Today.test.tsx` |
| AC-019 | Today > [AC-019] shows an error state | Unit | Passed | `frontend/src/screens/Today.test.tsx` |
| AC-020 | Today > [AC-020] shows the empty state | Unit | Passed | `frontend/src/screens/Today.test.tsx` |
| AC-021 | Today > [AC-021] shows the local ISO date | Unit | Passed | `frontend/src/screens/Today.test.tsx` |
| AC-002 | test_ac002_duplicate_signup_409_one_row | Integration | Failed | `backend/tests/acceptance/test_us001_acceptance.py` |
| AC-003 | test_ac003_nfr013_invalid_signup_names_field[-x-email] | Integration | Failed | `backend/tests/acceptance/test_us001_acceptance.py` |
| AC-003 | test_ac003_nfr013_invalid_signup_names_field[a@example.com--password] | Integration | Failed | `backend/tests/acceptance/test_us001_acceptance.py` |
| AC-003 | test_ac003_nfr013_invalid_signup_names_field[not-an-email-x-email] | Integration | Failed | `backend/tests/acceptance/test_us001_acceptance.py` |
| AC-004 | test_ac004_nfr001_password_hashed_everywhere | Integration | Failed | `backend/tests/acceptance/test_us001_acceptance.py` |
| AC-006 | test_ac006_nfr004_401_bodies_byte_identical | Integration | Failed | `backend/tests/acceptance/test_us001_acceptance.py` |
| AC-007 | test_ac007_nfr002_signout_revokes_token | Integration | Failed | `backend/tests/acceptance/test_us001_acceptance.py` |
| AC-008 | test_ac008_expired_session_401 | Integration | Failed | `backend/tests/acceptance/test_us001_acceptance.py` |
| AC-009 | test_ac009_nfr003_no_garbage_or_revoked_token | Integration | Failed | `backend/tests/acceptance/test_us001_acceptance.py` |
| AC-019, AC-020 | test_ac019_ac020_list_values_and_empty | Integration | Failed | `backend/tests/acceptance/test_us001_acceptance.py` |
| AC-021 | test_ac021_nfr012_own_day_across_utc_boundary[America/Los_Angeles-False-0] | Integration | Failed | `backend/tests/acceptance/test_us001_acceptance.py` |
| AC-021 | test_ac021_nfr012_own_day_across_utc_boundary[Pacific/Auckland-True-1] | Integration | Failed | `backend/tests/acceptance/test_us001_acceptance.py` |
| — | test_first_user_absent_when_settings_unset | Integration | Failed | `backend/tests/acceptance/test_us001_acceptance.py` |
| — | test_first_user_seeded_can_sign_in | Integration | Failed | `backend/tests/acceptance/test_us001_acceptance.py` |
| — | test_nfr005_users_never_see_each_others_habits | Integration | Failed | `backend/tests/acceptance/test_us001_acceptance.py` |
| AC-001 | test_ac001_signup_returns_token | Integration | Failed | `backend/tests/integration/test_auth.py` |
| AC-002 | test_ac002_duplicate_email_409 | Integration | Failed | `backend/tests/integration/test_auth.py` |
| AC-003 | test_ac003_validation_422[payload0-email] | Integration | Failed | `backend/tests/integration/test_auth.py` |
| AC-003 | test_ac003_validation_422[payload1-email] | Integration | Failed | `backend/tests/integration/test_auth.py` |
| AC-003 | test_ac003_validation_422[payload2-password] | Integration | Failed | `backend/tests/integration/test_auth.py` |
| AC-004 | test_ac004_password_stored_hashed | Integration | Failed | `backend/tests/integration/test_auth.py` |
| AC-005 | test_ac005_signin_ok_and_timezone_updates | Integration | Failed | `backend/tests/integration/test_auth.py` |
| AC-006 | test_ac006_identical_401 | Integration | Failed | `backend/tests/integration/test_auth.py` |
| AC-007 | test_ac007_signout_revokes | Integration | Failed | `backend/tests/integration/test_auth.py` |
| AC-008 | test_ac008_expired_session_401 | Integration | Failed | `backend/tests/integration/test_auth.py` |
| AC-009 | test_ac009_bad_token_401[Basic abc] | Integration | Failed | `backend/tests/integration/test_auth.py` |
| AC-009 | test_ac009_bad_token_401[Bearer unknown-token] | Integration | Failed | `backend/tests/integration/test_auth.py` |
| AC-009 | test_ac009_bad_token_401[Bearer] | Integration | Failed | `backend/tests/integration/test_auth.py` |
| AC-009 | test_ac009_bad_token_401[None] | Integration | Failed | `backend/tests/integration/test_auth.py` |
| AC-009 | test_ac009_bad_token_401[] | Integration | Failed | `backend/tests/integration/test_auth.py` |
| AC-009 | test_ac009_habits_lists_own_only | Integration | Failed | `backend/tests/integration/test_auth.py` |
| — | test_token_stored_hashed | Integration | Failed | `backend/tests/integration/test_auth.py` |
| AC-035 | test_ac035_rows_survive_restart | Integration | Failed | `backend/tests/integration/test_foundation.py` |
| AC-036 | test_ac036_indexes_exist_and_upgrade_is_idempotent | Integration | Failed | `backend/tests/integration/test_foundation.py` |
| — | test_cors_preflight_allows_authorization | Integration | Failed | `backend/tests/integration/test_foundation.py` |
| AC-009 | test_ac009_no_token_401 | Integration | Failed | `backend/tests/integration/test_habits.py` |
| AC-019 | test_ac019_lists_fields_and_isolates_users | Integration | Failed | `backend/tests/integration/test_habits.py` |
| AC-020 | test_ac020_no_habits_empty_list | Integration | Failed | `backend/tests/integration/test_habits.py` |
| AC-021 | test_ac021_today_follows_user_timezone[America/Los_Angeles-True-2] | Integration | Failed | `backend/tests/integration/test_habits.py` |
| AC-021 | test_ac021_today_follows_user_timezone[Pacific/Auckland-False-1] | Integration | Failed | `backend/tests/integration/test_habits.py` |
| AC-036 | test_ac036_constant_query_count | Integration | Failed | `backend/tests/integration/test_habits.py` |

## Sprint 2

### US-004: Add a habit

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-012 | Today > [AC-012] adds a habit and clears the input | Unit | Passed | `frontend/src/screens/Today.test.tsx` |
| AC-013 | Today > [AC-013] [NFR-013] blank name shows a name message and sends nothing | Unit | Passed | `frontend/src/screens/Today.test.tsx` |
| AC-014 | Today > [AC-014] a 422 on name shows the field message | Unit | Passed | `frontend/src/screens/Today.test.tsx` |
| AC-016 | Today > [AC-016] deleting after confirming removes the habit | Unit | Passed | `frontend/src/screens/Today.test.tsx` |
| AC-018 | Today > [AC-018] cancelling the confirmation keeps the habit | Unit | Passed | `frontend/src/screens/Today.test.tsx` |
| AC-022, AC-023, AC-030 | Today > [AC-022] [AC-023] [AC-030] tapping sends desired state and shows streak | Unit | Passed | `frontend/src/screens/Today.test.tsx` |
| AC-024 | Today > [AC-024] the row is disabled while the request is in flight | Unit | Passed | `frontend/src/screens/Today.test.tsx` |
| AC-025 | Today > [AC-025] offers no date controls | Unit | Passed | `frontend/src/screens/Today.test.tsx` |
| AC-010 | test_ac010_list_only_own_habits | Integration | Failed | `backend/tests/acceptance/test_us004_acceptance.py` |
| AC-011 | test_ac011_nfr005_cross_user_put_delete_404_unchanged | Integration | Failed | `backend/tests/acceptance/test_us004_acceptance.py` |
| AC-017 | test_ac017_nfr006_delete_removes_habit_and_completions | Integration | Failed | `backend/tests/acceptance/test_us004_acceptance.py` |
| AC-024 | test_ac024_nfr010_repeated_put_one_completion | Integration | Failed | `backend/tests/acceptance/test_us004_acceptance.py` |
| AC-012 | [AC-012] adds a habit and it is listed | E2E | Not run yet | `frontend/e2e/today.spec.ts` |
| AC-013 | [AC-013] [NFR-013] empty name is rejected with a name message | E2E | Not run yet | `frontend/e2e/today.spec.ts` |
| AC-014 | [AC-014] [NFR-013] name over 100 chars is rejected with a name message | E2E | Not run yet | `frontend/e2e/today.spec.ts` |
| AC-016 | [AC-016] delete after confirm removes habit permanently | E2E | Not run yet | `frontend/e2e/today.spec.ts` |
| AC-018 | [AC-018] cancel leaves the habit unchanged | E2E | Not run yet | `frontend/e2e/today.spec.ts` |
| AC-022, AC-023, AC-030 | [AC-022] [AC-023] [AC-030] tapping toggles done and streak immediately | E2E | Not run yet | `frontend/e2e/today.spec.ts` |
| AC-025 | [AC-025] no control to change a day other than today | E2E | Not run yet | `frontend/e2e/today.spec.ts` |

## Project setup

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| — | test_seeds_nothing_without_settings | Unit | Failed | `backend/tests/unit/test_bootstrap.py` |
| — | test_seeds_once_and_is_idempotent | Unit | Failed | `backend/tests/unit/test_bootstrap.py` |
| AC-011 | test_ac011_cross_user_and_missing_404 | Integration | Failed | `backend/tests/integration/test_habit_mutations.py` |
| AC-012 | test_ac012_create_returns_201_and_listed | Integration | Failed | `backend/tests/integration/test_habit_mutations.py` |
| AC-013, AC-014 | test_ac013_ac014_invalid_name_422[   ] | Integration | Failed | `backend/tests/integration/test_habit_mutations.py` |
| AC-013, AC-014 | test_ac013_ac014_invalid_name_422[] | Integration | Failed | `backend/tests/integration/test_habit_mutations.py` |
| AC-013, AC-014 | test_ac013_ac014_invalid_name_422[name2] | Integration | Failed | `backend/tests/integration/test_habit_mutations.py` |
| AC-015 | test_ac015_no_limit_and_100_chars_ok | Integration | Failed | `backend/tests/integration/test_habit_mutations.py` |
| AC-016, AC-017 | test_ac016_ac017_delete_cascades | Integration | Failed | `backend/tests/integration/test_habit_mutations.py` |
| AC-022, AC-023, AC-024 | test_ac022_ac023_ac024_toggle_idempotent | Integration | Failed | `backend/tests/integration/test_habit_mutations.py` |
| AC-025 | test_ac025_no_date_endpoint | Integration | Failed | `backend/tests/integration/test_habit_mutations.py` |
| — | test_mutations_401_without_valid_token | Integration | Failed | `backend/tests/integration/test_habit_mutations.py` |
| — | test_health_reports_ok | Integration | Failed | `backend/tests/integration/test_health.py` |
| — | test_the_openapi_document_builds | Integration | Failed | `backend/tests/integration/test_health.py` |
| — | the app loads | E2E | Passed | `frontend/e2e/example.spec.ts` |
<!-- sdlc:auto:end tests -->
