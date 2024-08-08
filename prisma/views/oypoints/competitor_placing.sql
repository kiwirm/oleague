WITH `total_points` AS (
  SELECT
    `oypoints`.`points`.`league_id` AS `league_id`,
    `oypoints`.`points`.`season_id` AS `season_id`,
    `oypoints`.`points`.`onz_id` AS `onz_id`,
    sum(`oypoints`.`points`.`points`) AS `total_points`
  FROM
    `oypoints`.`points`
  GROUP BY
    `oypoints`.`points`.`league_id`,
    `oypoints`.`points`.`season_id`,
    `oypoints`.`points`.`onz_id`
),
`predicted_points` AS (
  SELECT
    `oypoints`.`season`.`league_id` AS `league_id`,
    `oypoints`.`season`.`season_id` AS `season_id`,
    `total_points`.`onz_id` AS `onz_id`,
    least(
      (
        (
          `total_points`.`total_points` / `oypoints`.`season`.`last_event`
        ) * `oypoints`.`season`.`num_events`
      ),
(
        `oypoints`.`season`.`max_points` * `oypoints`.`season`.`num_events`
      )
    ) AS `prediction`
  FROM
    (
      `total_points`
      JOIN `oypoints`.`season` ON(
        (
          (
            `oypoints`.`season`.`league_id` = `total_points`.`league_id`
          )
          AND (
            `oypoints`.`season`.`season_id` = `total_points`.`season_id`
          )
        )
      )
    )
),
`ranked_points` AS (
  SELECT
    `total_points`.`league_id` AS `league_id`,
    `total_points`.`season_id` AS `season_id`,
    `total_points`.`onz_id` AS `onz_id`,
    `total_points`.`total_points` AS `total_points`,
    `predicted_points`.`prediction` AS `prediction`,
    `oypoints`.`competitor_eligibility`.`grade_id` AS `grade_id`,
    rank() OVER (
      PARTITION BY `total_points`.`league_id`,
      `total_points`.`season_id`,
      `oypoints`.`competitor_eligibility`.`grade_id`
      ORDER BY
        `total_points`.`total_points` DESC
    ) AS `placing`,
    rank() OVER (
      PARTITION BY `total_points`.`league_id`,
      `total_points`.`season_id`,
      `oypoints`.`competitor_eligibility`.`grade_id`
      ORDER BY
        `predicted_points`.`prediction` DESC
    ) AS `predicted_placing`
  FROM
    (
      (
        `total_points`
        JOIN `predicted_points` ON(
          (
            (
              `predicted_points`.`league_id` = `total_points`.`league_id`
            )
            AND (
              `predicted_points`.`season_id` = `total_points`.`season_id`
            )
            AND (
              `total_points`.`onz_id` = `predicted_points`.`onz_id`
            )
          )
        )
      )
      JOIN `oypoints`.`competitor_eligibility` ON(
        (
          (
            `total_points`.`league_id` = `oypoints`.`competitor_eligibility`.`league_id`
          )
          AND (
            `total_points`.`season_id` = `oypoints`.`competitor_eligibility`.`season_id`
          )
          AND (
            `total_points`.`onz_id` = `oypoints`.`competitor_eligibility`.`onz_id`
          )
        )
      )
    )
)
SELECT
  `ranked_points`.`league_id` AS `league_id`,
  `ranked_points`.`season_id` AS `season_id`,
  `ranked_points`.`onz_id` AS `onz_id`,
  `ranked_points`.`total_points` AS `total_points`,
  `ranked_points`.`prediction` AS `prediction`,
  `ranked_points`.`grade_id` AS `grade_id`,
  `ranked_points`.`placing` AS `placing`,
  `ranked_points`.`predicted_placing` AS `predicted_placing`
FROM
  `ranked_points`