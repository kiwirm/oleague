WITH `grade_mapping_collapsed` AS (
  SELECT
    DISTINCT `oypoints`.`grade_mapping`.`league_id` AS `league_id`,
    `oypoints`.`grade_mapping`.`season_id` AS `season_id`,
    `oypoints`.`grade_mapping`.`event_number` AS `event_number`,
    `oypoints`.`grade_mapping`.`grade_id` AS `grade_id`,
    `oypoints`.`grade_mapping`.`race_grade` AS `race_grade`
  FROM
    `oypoints`.`grade_mapping`
),
`grade_counts` AS (
  SELECT
    `grade_mapping_collapsed`.`league_id` AS `league_id`,
    `grade_mapping_collapsed`.`season_id` AS `season_id`,
    `oypoints`.`result_collapsed`.`onz_id` AS `onz_id`,
    `grade_mapping_collapsed`.`grade_id` AS `grade_id`,
    count(0) AS `occurrences`
  FROM
    (
      `oypoints`.`result_collapsed`
      JOIN `grade_mapping_collapsed` ON(
        (
          (
            `oypoints`.`result_collapsed`.`league_id` = `grade_mapping_collapsed`.`league_id`
          )
          AND (
            `oypoints`.`result_collapsed`.`season_id` = `grade_mapping_collapsed`.`season_id`
          )
          AND (
            `oypoints`.`result_collapsed`.`event_number` = `grade_mapping_collapsed`.`event_number`
          )
          AND (
            `oypoints`.`result_collapsed`.`race_grade` = `grade_mapping_collapsed`.`race_grade`
          )
        )
      )
    )
  WHERE
    (
      `oypoints`.`result_collapsed`.`status_result` <> 'DNS'
    )
  GROUP BY
    `grade_mapping_collapsed`.`league_id`,
    `grade_mapping_collapsed`.`season_id`,
    `oypoints`.`result_collapsed`.`onz_id`,
    `grade_mapping_collapsed`.`grade_id`
),
`events_competed` AS (
  SELECT
    `oypoints`.`result_collapsed`.`league_id` AS `league_id`,
    `oypoints`.`result_collapsed`.`season_id` AS `season_id`,
    `oypoints`.`result_collapsed`.`onz_id` AS `onz_id`,
    count(0) AS `num_results`
  FROM
    `oypoints`.`result_collapsed`
  WHERE
    (
      `oypoints`.`result_collapsed`.`status_result` <> 'DNS'
    )
  GROUP BY
    `oypoints`.`result_collapsed`.`league_id`,
    `oypoints`.`result_collapsed`.`season_id`,
    `oypoints`.`result_collapsed`.`onz_id`
),
`eligibility` AS (
  SELECT
    `oypoints`.`season`.`league_id` AS `league_id`,
    `oypoints`.`season`.`season_id` AS `season_id`,
    `events_competed`.`onz_id` AS `onz_id`,
    `events_competed`.`num_results` AS `num_results`,
(
      `oypoints`.`season`.`num_events` - `oypoints`.`season`.`last_event`
    ) AS `events_to_go`,
    greatest(
      (
        `oypoints`.`season`.`required_events` - `events_competed`.`num_results`
      ),
      0
    ) AS `events_needed`,
(
      CASE
        WHEN (
          `events_competed`.`num_results` >= `oypoints`.`season`.`required_events`
        ) THEN 'QUAL'
        WHEN (
          (
            `oypoints`.`season`.`num_events` - `oypoints`.`season`.`last_event`
          ) < greatest(
            (
              `oypoints`.`season`.`required_events` - `events_competed`.`num_results`
            ),
            0
          )
        ) THEN 'INEL'
        ELSE 'PEND'
      END
    ) AS `eligibility_id`
  FROM
    (
      `events_competed`
      JOIN `oypoints`.`season`
    )
  WHERE
    (
      (
        `oypoints`.`season`.`league_id` = `events_competed`.`league_id`
      )
      AND (
        `oypoints`.`season`.`season_id` = `events_competed`.`season_id`
      )
    )
),
`grades_with_difficulty` AS (
  SELECT
    `grade_counts`.`league_id` AS `league_id`,
    `grade_counts`.`season_id` AS `season_id`,
    `grade_counts`.`onz_id` AS `onz_id`,
    `grade_counts`.`grade_id` AS `grade_id`,
    `grade_counts`.`occurrences` AS `occurrences`,
    `oypoints`.`grade`.`difficulty` AS `difficulty`
  FROM
    (
      `grade_counts`
      JOIN `oypoints`.`grade` ON(
        (
          (
            `oypoints`.`grade`.`league_id` = `grade_counts`.`league_id`
          )
          AND (
            `oypoints`.`grade`.`season_id` = `grade_counts`.`season_id`
          )
          AND (
            `oypoints`.`grade`.`grade_id` = `grade_counts`.`grade_id`
          )
        )
      )
    )
  ORDER BY
    `grade_counts`.`league_id`,
    `grade_counts`.`season_id`,
    `grade_counts`.`onz_id`
),
`ranked_grades` AS (
  SELECT
    `grades_with_difficulty`.`league_id` AS `league_id`,
    `grades_with_difficulty`.`season_id` AS `season_id`,
    `grades_with_difficulty`.`onz_id` AS `onz_id`,
    `grades_with_difficulty`.`grade_id` AS `grade_id`,
    `grades_with_difficulty`.`occurrences` AS `occurrences`,
    `grades_with_difficulty`.`difficulty` AS `difficulty`,
    row_number() OVER (
      PARTITION BY `grades_with_difficulty`.`league_id`,
      `grades_with_difficulty`.`season_id`,
      `grades_with_difficulty`.`onz_id`
      ORDER BY
        `grades_with_difficulty`.`occurrences` DESC,
        `grades_with_difficulty`.`difficulty` DESC
    ) AS `rn`
  FROM
    `grades_with_difficulty`
),
`selected_grades` AS (
  SELECT
    `ranked_grades`.`league_id` AS `league_id`,
    `ranked_grades`.`season_id` AS `season_id`,
    `ranked_grades`.`onz_id` AS `onz_id`,
    `ranked_grades`.`grade_id` AS `grade_id`
  FROM
    `ranked_grades`
  WHERE
    (`ranked_grades`.`rn` = 1)
  ORDER BY
    `ranked_grades`.`league_id`,
    `ranked_grades`.`season_id`,
    `ranked_grades`.`onz_id`
),
`member_season_progress_new` AS (
  SELECT
    `selected_grades`.`league_id` AS `league_id`,
    `selected_grades`.`season_id` AS `season_id`,
    `selected_grades`.`onz_id` AS `onz_id`,
    `selected_grades`.`grade_id` AS `grade_id`,
    `eligibility`.`eligibility_id` AS `eligibility_id`,
    `eligibility`.`num_results` AS `num_results`,
    `eligibility`.`events_needed` AS `events_needed`
  FROM
    (
      `selected_grades`
      JOIN `eligibility` ON(
        (
          (
            `selected_grades`.`onz_id` = `eligibility`.`onz_id`
          )
          AND (
            `selected_grades`.`league_id` = `eligibility`.`league_id`
          )
          AND (
            `selected_grades`.`season_id` = `eligibility`.`season_id`
          )
        )
      )
    )
)
SELECT
  `member_season_progress_new`.`league_id` AS `league_id`,
  `member_season_progress_new`.`season_id` AS `season_id`,
  `member_season_progress_new`.`onz_id` AS `onz_id`,
  `member_season_progress_new`.`grade_id` AS `grade_id`,
  `member_season_progress_new`.`eligibility_id` AS `eligibility_id`,
  `member_season_progress_new`.`num_results` AS `num_results`,
  `member_season_progress_new`.`events_needed` AS `events_needed`
FROM
  `member_season_progress_new`