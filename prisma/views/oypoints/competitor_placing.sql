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
`ranked_points` AS (
  SELECT
    `total_points`.`league_id` AS `league_id`,
    `total_points`.`season_id` AS `season_id`,
    `total_points`.`onz_id` AS `onz_id`,
    `total_points`.`total_points` AS `total_points`,
    `oypoints`.`competitor_eligibility`.`grade_id` AS `grade_id`,
    `oypoints`.`competitor_eligibility`.`eligibility_id` AS `eligibility`,
    rank() OVER (
      PARTITION BY `total_points`.`league_id`,
      `total_points`.`season_id`,
      `oypoints`.`competitor_eligibility`.`grade_id`
      ORDER BY
        `oypoints`.`competitor_eligibility`.`eligibility_id` DESC,
        `total_points`.`total_points` DESC
    ) AS `placing`
  FROM
    (
      `total_points`
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
  `ranked_points`.`eligibility` AS `eligibility`,
  `ranked_points`.`season_id` AS `season_id`,
  `ranked_points`.`onz_id` AS `onz_id`,
  `ranked_points`.`total_points` AS `total_points`,
  `ranked_points`.`grade_id` AS `grade_id`,
  `ranked_points`.`placing` AS `placing`
FROM
  `ranked_points`