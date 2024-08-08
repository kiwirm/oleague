WITH `events_matrix` AS (
  SELECT
    `oypoints`.`event`.`league_id` AS `league_id`,
    `oypoints`.`event`.`season_id` AS `season_id`,
    `oypoints`.`competitor_eligibility`.`onz_id` AS `onz_id`,
    `oypoints`.`event`.`event_number` AS `event_number`
  FROM
    (
      `oypoints`.`competitor_eligibility`
      JOIN `oypoints`.`event` ON(
        (
          (
            `oypoints`.`competitor_eligibility`.`league_id` = `oypoints`.`event`.`league_id`
          )
          AND (
            `oypoints`.`competitor_eligibility`.`season_id` = `oypoints`.`event`.`season_id`
          )
        )
      )
    )
)
SELECT
  `events_matrix`.`league_id` AS `league_id`,
  `events_matrix`.`season_id` AS `season_id`,
  `events_matrix`.`onz_id` AS `onz_id`,
  `events_matrix`.`event_number` AS `event_number`,
  `oypoints`.`points`.`status_grade` AS `status_grade`,
  `oypoints`.`points`.`status_result` AS `status_result`,
  `oypoints`.`points`.`points` AS `points`,
  `oypoints`.`points`.`counts_towards_total` AS `counts_towards_total`
FROM
  (
    `events_matrix`
    LEFT JOIN `oypoints`.`points` ON(
      (
        (
          `events_matrix`.`league_id` = `oypoints`.`points`.`league_id`
        )
        AND (
          `events_matrix`.`season_id` = `oypoints`.`points`.`season_id`
        )
        AND (
          `events_matrix`.`onz_id` = `oypoints`.`points`.`onz_id`
        )
        AND (
          `events_matrix`.`event_number` = `oypoints`.`points`.`event_number`
        )
      )
    )
  )