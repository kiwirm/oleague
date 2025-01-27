SELECT
  `oypoints`.`result`.`league_id` AS `league_id`,
  `oypoints`.`result`.`season_id` AS `season_id`,
  `oypoints`.`result`.`onz_id` AS `onz_id`,
  `oypoints`.`result`.`event_number` AS `event_number`,
  sum(`oypoints`.`result`.`time`) AS `time`,
  min(`oypoints`.`result`.`race_grade`) AS `race_grade`,
  min(`oypoints`.`result`.`scorer_id`) AS `scorer_id`,
(
    CASE
      WHEN (
        max(
          (
            CASE
              WHEN (`oypoints`.`result`.`status_result_id` = 'DNS') THEN 1
              ELSE 0
            END
          )
        ) > 0
      ) THEN 'DNS'
      WHEN (
        max(
          (
            CASE
              WHEN (`oypoints`.`result`.`status_result_id` = 'DNF') THEN 1
              ELSE 0
            END
          )
        ) > 0
      ) THEN 'DNF'
      WHEN (
        max(
          (
            CASE
              WHEN (`oypoints`.`result`.`status_result_id` = 'MP') THEN 1
              ELSE 0
            END
          )
        ) > 0
      ) THEN 'MP'
      WHEN (
        count(DISTINCT `oypoints`.`result`.`race_number`) < (
          SELECT
            count(0)
          FROM
            `oypoints`.`race`
          WHERE
            (
              (
                `oypoints`.`race`.`league_id` = `oypoints`.`result`.`league_id`
              )
              AND (
                `oypoints`.`race`.`season_id` = `oypoints`.`result`.`season_id`
              )
              AND (
                `oypoints`.`race`.`event_number` = `oypoints`.`result`.`event_number`
              )
            )
        )
      ) THEN 'NA'
      ELSE 'OK'
    END
  ) AS `status_result`,
  sum(`oypoints`.`result`.`raw_score`) AS `raw_score`,
  sum(`oypoints`.`result`.`score`) AS `score`
FROM
  `oypoints`.`result`
GROUP BY
  `oypoints`.`result`.`onz_id`,
  `oypoints`.`result`.`league_id`,
  `oypoints`.`result`.`season_id`,
  `oypoints`.`result`.`event_number`