WITH `potential_grade_allocated_results` AS (
  SELECT
    `oypoints`.`result`.`league_id` AS `league_id`,
    `oypoints`.`result`.`season_id` AS `season_id`,
    `oypoints`.`result`.`onz_id` AS `onz_id`,
    `oypoints`.`result`.`event_number` AS `event_number`,
    `oypoints`.`result`.`race_grade` AS `true_race_grade`,
    `potential_grade`.`grade_id` AS `potential_grade_id`,
    `member_grade`.`grade_id` AS `member_grade_id`,
(
      CASE
        WHEN (
          `member_grade`.`grade_id` = `potential_grade`.`grade_id`
        ) THEN 'RUNNING'
        WHEN (
          `member_grade`.`difficulty` < `potential_grade`.`difficulty`
        ) THEN 'RUNNING_UP'
        WHEN (
          `member_grade`.`difficulty` > `potential_grade`.`difficulty`
        ) THEN 'RUNNING_DOWN'
        ELSE 'RUNNING_OTHER'
      END
    ) AS `status_grade`,
    `oypoints`.`result`.`status_result` AS `status_result`
  FROM
    (
      (
        (
          (
            `oypoints`.`result_collapsed` `result`
            JOIN `oypoints`.`grade_mapping` `gm` ON(
              (
                (
                  `oypoints`.`result`.`race_grade` = `gm`.`race_grade`
                )
                AND (
                  `oypoints`.`result`.`league_id` = `gm`.`league_id`
                )
                AND (
                  `oypoints`.`result`.`season_id` = `gm`.`season_id`
                )
                AND (
                  `oypoints`.`result`.`event_number` = `gm`.`event_number`
                )
              )
            )
          )
          JOIN `oypoints`.`competitor_eligibility` ON(
            (
              (
                `oypoints`.`result`.`league_id` = `oypoints`.`competitor_eligibility`.`league_id`
              )
              AND (
                `oypoints`.`result`.`season_id` = `oypoints`.`competitor_eligibility`.`season_id`
              )
              AND (
                `oypoints`.`result`.`onz_id` = `oypoints`.`competitor_eligibility`.`onz_id`
              )
            )
          )
        )
        JOIN `oypoints`.`grade` `potential_grade` ON(
          (
            (
              `potential_grade`.`league_id` = `oypoints`.`result`.`league_id`
            )
            AND (
              `potential_grade`.`season_id` = `oypoints`.`result`.`season_id`
            )
            AND (`potential_grade`.`grade_id` = `gm`.`grade_id`)
          )
        )
      )
      JOIN `oypoints`.`grade` `member_grade` ON(
        (
          (
            `member_grade`.`league_id` = `oypoints`.`result`.`league_id`
          )
          AND (
            `member_grade`.`season_id` = `oypoints`.`result`.`season_id`
          )
          AND (
            `oypoints`.`competitor_eligibility`.`grade_id` = `member_grade`.`grade_id`
          )
        )
      )
    )
  UNION
  SELECT
    `oypoints`.`organiser`.`league_id` AS `league_id`,
    `oypoints`.`organiser`.`season_id` AS `season_id`,
    `oypoints`.`organiser`.`onz_id` AS `onz_id`,
    `oypoints`.`organiser`.`event_number` AS `event_number`,
    NULL AS `true_race_grade`,
    NULL AS `potential_grade_id`,
    NULL AS `member_grade_id`,
    'ORGANISING' AS `status_grade`,
    `oypoints`.`organiser`.`organiser_role_id` AS `status_result`
  FROM
    `oypoints`.`organiser`
),
`grade_allocated_result` AS (
  SELECT
    `ranking`.`league_id` AS `league_id`,
    `ranking`.`season_id` AS `season_id`,
    `ranking`.`onz_id` AS `onz_id`,
    `ranking`.`event_number` AS `event_number`,
    `ranking`.`potential_grade_id` AS `grade_id`,
    `ranking`.`status_grade` AS `status_grade`,
    `ranking`.`status_result` AS `status_result`
  FROM
    (
      SELECT
        `potential_grade_allocated_results`.`league_id` AS `league_id`,
        `potential_grade_allocated_results`.`season_id` AS `season_id`,
        `potential_grade_allocated_results`.`onz_id` AS `onz_id`,
        `potential_grade_allocated_results`.`event_number` AS `event_number`,
        `potential_grade_allocated_results`.`true_race_grade` AS `true_race_grade`,
        `potential_grade_allocated_results`.`potential_grade_id` AS `potential_grade_id`,
        `potential_grade_allocated_results`.`member_grade_id` AS `member_grade_id`,
        `potential_grade_allocated_results`.`status_grade` AS `status_grade`,
        `potential_grade_allocated_results`.`status_result` AS `status_result`,
        row_number() OVER (
          PARTITION BY `potential_grade_allocated_results`.`league_id`,
          `potential_grade_allocated_results`.`season_id`,
          `potential_grade_allocated_results`.`onz_id`,
          `potential_grade_allocated_results`.`event_number`
          ORDER BY
            (
              CASE
                `potential_grade_allocated_results`.`status_grade`
                WHEN 'ORGANISING' THEN 1
                WHEN 'RUNNING' THEN 0
                WHEN 'RUNNING_UP' THEN -(1)
                WHEN 'RUNNING_DOWN' THEN -(3)
                ELSE -(2)
              END
            ) DESC
        ) AS `ranked_order`
      FROM
        `potential_grade_allocated_results`
    ) `ranking`
  WHERE
    (`ranking`.`ranked_order` = 1)
),
`grade_winning_time` AS (
  SELECT
    `grade_allocated_result`.`league_id` AS `league_id`,
    `grade_allocated_result`.`season_id` AS `season_id`,
    `grade_allocated_result`.`grade_id` AS `grade_id`,
    `grade_allocated_result`.`event_number` AS `event_number`,
(
      SELECT
        sum(`oypoints`.`race`.`max_score`)
      FROM
        `oypoints`.`race`
      WHERE
        (
          (
            `oypoints`.`race`.`league_id` = `grade_allocated_result`.`league_id`
          )
          AND (
            `oypoints`.`race`.`season_id` = `grade_allocated_result`.`season_id`
          )
          AND (
            `oypoints`.`race`.`event_number` = `grade_allocated_result`.`event_number`
          )
        )
    ) AS `score_to_clear`,
    max(`oypoints`.`result_collapsed`.`score`) AS `winning_score`,
    IF(
      (
        max(`oypoints`.`result_collapsed`.`score`) < (
          SELECT
            `score_to_clear`
        )
      ),
      NULL,
      min(`oypoints`.`result_collapsed`.`time`)
    ) AS `winning_time`,
    IF(
      (
        max(`oypoints`.`result_collapsed`.`score`) = (
          SELECT
            `score_to_clear`
        )
      ),
      max(`oypoints`.`result_collapsed`.`time`),
      NULL
    ) AS `slowest_winning_time`
  FROM
    (
      (
        `grade_allocated_result`
        JOIN `oypoints`.`result_collapsed` ON(
          (
            (
              `oypoints`.`result_collapsed`.`league_id` = `grade_allocated_result`.`league_id`
            )
            AND (
              `oypoints`.`result_collapsed`.`season_id` = `grade_allocated_result`.`season_id`
            )
            AND (
              `oypoints`.`result_collapsed`.`onz_id` = `grade_allocated_result`.`onz_id`
            )
            AND (
              `oypoints`.`result_collapsed`.`event_number` = `grade_allocated_result`.`event_number`
            )
          )
        )
      )
      JOIN `oypoints`.`competitor_eligibility` ON(
        (
          (
            `oypoints`.`competitor_eligibility`.`league_id` = `grade_allocated_result`.`league_id`
          )
          AND (
            `grade_allocated_result`.`season_id` = `oypoints`.`competitor_eligibility`.`season_id`
          )
          AND (
            `grade_allocated_result`.`onz_id` = `oypoints`.`competitor_eligibility`.`onz_id`
          )
        )
      )
    )
  WHERE
    (
      (
        `grade_allocated_result`.`status_grade` = 'RUNNING'
      )
      AND (`grade_allocated_result`.`status_result` = 'OK')
      AND (
        `oypoints`.`competitor_eligibility`.`eligibility_id` <> 'INEL'
      )
    )
  GROUP BY
    `grade_allocated_result`.`league_id`,
    `grade_allocated_result`.`season_id`,
    `grade_allocated_result`.`grade_id`,
    `grade_allocated_result`.`event_number`
  ORDER BY
    `grade_allocated_result`.`league_id`,
    `grade_allocated_result`.`season_id`,
    `grade_allocated_result`.`event_number`
),
`calculated_points` AS (
  SELECT
    `grade_allocated_result`.`league_id` AS `league_id`,
    `grade_allocated_result`.`season_id` AS `season_id`,
    `grade_allocated_result`.`onz_id` AS `onz_id`,
    `grade_winning_time`.`grade_id` AS `grade_id`,
    `grade_allocated_result`.`event_number` AS `event_number`,
    `grade_allocated_result`.`status_grade` AS `status_grade`,
(
      CASE
        WHEN (
          (`grade_winning_time`.`winning_time` IS NULL)
          AND (`grade_winning_time`.`winning_score` IS NULL)
          AND (
            `grade_allocated_result`.`status_grade` <> 'ORGANISING'
          )
        ) THEN 'NW'
        WHEN (
          (
            `grade_allocated_result`.`status_grade` = 'RUNNING'
          )
          AND (`grade_allocated_result`.`status_result` = 'OK')
          AND (
            (
              `oypoints`.`result_collapsed`.`time` = `grade_winning_time`.`winning_time`
            )
            OR (`grade_winning_time`.`winning_time` IS NULL)
          )
          AND (
            (
              `oypoints`.`result_collapsed`.`score` = `grade_winning_time`.`winning_score`
            )
            OR (`grade_winning_time`.`winning_score` IS NULL)
          )
        ) THEN 'WIN'
        ELSE `grade_allocated_result`.`status_result`
      END
    ) AS `status_result`,
(
      CASE
        WHEN (
          `grade_allocated_result`.`status_grade` = 'ORGANISING'
        ) THEN (
          SELECT
            `oypoints`.`season`.`max_points`
          FROM
            `oypoints`.`season`
          WHERE
            (
              (
                `oypoints`.`season`.`league_id` = `grade_allocated_result`.`league_id`
              )
              AND (
                `oypoints`.`season`.`season_id` = `grade_allocated_result`.`season_id`
              )
            )
        )
        WHEN (
          (`grade_winning_time`.`winning_time` IS NULL)
          AND (`grade_winning_time`.`winning_score` IS NULL)
        ) THEN 0
        WHEN (`grade_allocated_result`.`status_result` = 'DNS') THEN 0
        WHEN (
          `grade_allocated_result`.`status_result` IN ('MP', 'DNF', 'NA')
        ) THEN (
          SELECT
            `oypoints`.`season`.`participation_points`
          FROM
            `oypoints`.`season`
          WHERE
            (
              (
                `oypoints`.`season`.`league_id` = `grade_allocated_result`.`league_id`
              )
              AND (
                `oypoints`.`season`.`season_id` = `grade_allocated_result`.`season_id`
              )
            )
        )
        WHEN (
          `grade_allocated_result`.`status_grade` = 'RUNNING_DOWN'
        ) THEN (
          SELECT
            `oypoints`.`season`.`participation_points`
          FROM
            `oypoints`.`season`
          WHERE
            (
              (
                `oypoints`.`season`.`league_id` = `grade_allocated_result`.`league_id`
              )
              AND (
                `oypoints`.`season`.`season_id` = `grade_allocated_result`.`season_id`
              )
            )
        )
        WHEN (
          `grade_allocated_result`.`status_grade` = 'RUNNING_UP'
        ) THEN (
          SELECT
            `oypoints`.`season`.`min_points`
          FROM
            `oypoints`.`season`
          WHERE
            (
              (
                `oypoints`.`season`.`league_id` = `grade_allocated_result`.`league_id`
              )
              AND (
                `oypoints`.`season`.`season_id` = `grade_allocated_result`.`season_id`
              )
            )
        )
        WHEN (
          `grade_allocated_result`.`status_grade` = 'RUNNING'
        ) THEN IF(
          (
            (
              `oypoints`.`result_collapsed`.`score` = `grade_winning_time`.`score_to_clear`
            )
            OR (`oypoints`.`result_collapsed`.`score` IS NULL)
          ),
(
            floor(
              (
                greatest(
                  (
                    (
                      `grade_winning_time`.`winning_time` / `oypoints`.`result_collapsed`.`time`
                    ) * (
                      SELECT
                        `oypoints`.`season`.`max_points`
                      FROM
                        `oypoints`.`season`
                      WHERE
                        (
                          (
                            `oypoints`.`season`.`league_id` = `grade_allocated_result`.`league_id`
                          )
                          AND (
                            `oypoints`.`season`.`season_id` = `grade_allocated_result`.`season_id`
                          )
                        )
                    )
                  ),
(
                    SELECT
                      `oypoints`.`season`.`min_points`
                    FROM
                      `oypoints`.`season`
                    WHERE
                      (
                        (
                          `oypoints`.`season`.`league_id` = `grade_allocated_result`.`league_id`
                        )
                        AND (
                          `oypoints`.`season`.`season_id` = `grade_allocated_result`.`season_id`
                        )
                      )
                  )
                ) * 10
              )
            ) / 10
          ),
(
            floor(
              (
                greatest(
                  (
                    (
                      (
                        `oypoints`.`result_collapsed`.`score` / `grade_winning_time`.`winning_score`
                      ) * IF(
                        (
                          `grade_winning_time`.`winning_score` = `grade_winning_time`.`score_to_clear`
                        ),
(
                          `grade_winning_time`.`winning_time` / `grade_winning_time`.`slowest_winning_time`
                        ),
                        1
                      )
                    ) * (
                      SELECT
                        `oypoints`.`season`.`max_points`
                      FROM
                        `oypoints`.`season`
                      WHERE
                        (
                          (
                            `oypoints`.`season`.`league_id` = `grade_allocated_result`.`league_id`
                          )
                          AND (
                            `oypoints`.`season`.`season_id` = `grade_allocated_result`.`season_id`
                          )
                        )
                    )
                  ),
(
                    SELECT
                      `oypoints`.`season`.`min_points`
                    FROM
                      `oypoints`.`season`
                    WHERE
                      (
                        (
                          `oypoints`.`season`.`league_id` = `grade_allocated_result`.`league_id`
                        )
                        AND (
                          `oypoints`.`season`.`season_id` = `grade_allocated_result`.`season_id`
                        )
                      )
                  )
                ) * 10
              )
            ) / 10
          )
        )
      END
    ) AS `points`
  FROM
    (
      (
        `grade_allocated_result`
        LEFT JOIN `grade_winning_time` ON(
          (
            (
              `grade_winning_time`.`league_id` = `grade_allocated_result`.`league_id`
            )
            AND (
              `grade_winning_time`.`season_id` = `grade_allocated_result`.`season_id`
            )
            AND (
              `grade_allocated_result`.`grade_id` = `grade_winning_time`.`grade_id`
            )
            AND (
              `grade_allocated_result`.`event_number` = `grade_winning_time`.`event_number`
            )
          )
        )
      )
      LEFT JOIN `oypoints`.`result_collapsed` ON(
        (
          (
            `grade_allocated_result`.`league_id` = `oypoints`.`result_collapsed`.`league_id`
          )
          AND (
            `grade_allocated_result`.`season_id` = `oypoints`.`result_collapsed`.`season_id`
          )
          AND (
            `grade_allocated_result`.`onz_id` = `oypoints`.`result_collapsed`.`onz_id`
          )
          AND (
            `grade_allocated_result`.`event_number` = `oypoints`.`result_collapsed`.`event_number`
          )
        )
      )
    )
),
`ranked_points` AS (
  SELECT
    `calculated_points`.`league_id` AS `league_id`,
    `calculated_points`.`season_id` AS `season_id`,
    `calculated_points`.`onz_id` AS `onz_id`,
    `calculated_points`.`event_number` AS `event_number`,
    rank() OVER (
      PARTITION BY `calculated_points`.`league_id`,
      `calculated_points`.`season_id`,
      `calculated_points`.`onz_id`
      ORDER BY
        `calculated_points`.`points` DESC
    ) AS `ranked`
  FROM
    `calculated_points`
),
`points_with_counts` AS (
  SELECT
    `calculated_points`.`league_id` AS `league_id`,
    `calculated_points`.`season_id` AS `season_id`,
    `calculated_points`.`onz_id` AS `onz_id`,
    `calculated_points`.`event_number` AS `event_number`,
    `calculated_points`.`grade_id` AS `grade_id`,
    `calculated_points`.`status_grade` AS `status_grade`,
    `calculated_points`.`status_result` AS `status_result`,
    `calculated_points`.`points` AS `points`,
(
      (`ranked_points`.`ranked` <= 5)
      AND (
        `oypoints`.`competitor_eligibility`.`eligibility_id` <> 'INEL'
      )
    ) AS `counts_towards_total`,
    rank() OVER (
      PARTITION BY `calculated_points`.`league_id`,
      `calculated_points`.`season_id`,
      `calculated_points`.`event_number`,
      `calculated_points`.`grade_id`
      ORDER BY
        `calculated_points`.`points` DESC
    ) AS `placing`
  FROM
    (
      (
        `calculated_points`
        JOIN `ranked_points` ON(
          (
            (
              `calculated_points`.`league_id` = `ranked_points`.`league_id`
            )
            AND (
              `ranked_points`.`season_id` = `calculated_points`.`season_id`
            )
            AND (
              `ranked_points`.`onz_id` = `calculated_points`.`onz_id`
            )
            AND (
              `calculated_points`.`event_number` = `ranked_points`.`event_number`
            )
          )
        )
      )
      JOIN `oypoints`.`competitor_eligibility` ON(
        (
          (
            `oypoints`.`competitor_eligibility`.`onz_id` = `calculated_points`.`onz_id`
          )
          AND (
            `oypoints`.`competitor_eligibility`.`league_id` = `calculated_points`.`league_id`
          )
          AND (
            `oypoints`.`competitor_eligibility`.`season_id` = `calculated_points`.`season_id`
          )
        )
      )
    )
)
SELECT
  `points_with_counts`.`league_id` AS `league_id`,
  `points_with_counts`.`season_id` AS `season_id`,
  `points_with_counts`.`onz_id` AS `onz_id`,
  `points_with_counts`.`event_number` AS `event_number`,
  `points_with_counts`.`status_grade` AS `status_grade`,
  `points_with_counts`.`status_result` AS `status_result`,
  `points_with_counts`.`points` AS `points`,
  `points_with_counts`.`counts_towards_total` AS `counts_towards_total`,
  `points_with_counts`.`placing` AS `placing`
FROM
  `points_with_counts`