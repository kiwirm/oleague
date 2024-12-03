SELECT
  `oypoints`.`competitor_eligibility`.`league_id` AS `league_id`,
  `oypoints`.`competitor_eligibility`.`season_id` AS `season_id`,
  `oypoints`.`competitor_eligibility`.`onz_id` AS `onz_id`,
  `oypoints`.`competitor_eligibility`.`grade_id` AS `grade_id`,
  `oypoints`.`competitor_eligibility`.`eligibility_id` AS `eligibility_id`,
  `oypoints`.`competitor_placing`.`total_points` AS `total_points`,
  `oypoints`.`competitor_placing`.`placing` AS `placing`
FROM
  (
    `oypoints`.`competitor_eligibility`
    JOIN `oypoints`.`competitor_placing` ON(
      (
        (
          `oypoints`.`competitor_eligibility`.`league_id` = `oypoints`.`competitor_placing`.`league_id`
        )
        AND (
          `oypoints`.`competitor_eligibility`.`season_id` = `oypoints`.`competitor_placing`.`season_id`
        )
        AND (
          `oypoints`.`competitor_eligibility`.`onz_id` = `oypoints`.`competitor_placing`.`onz_id`
        )
      )
    )
  )