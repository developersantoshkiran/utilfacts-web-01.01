-- Custom SQL migration file, put you code below! --

SELECT * from create_hypertable('entity_consumption',by_range('created_At'), if_not_exists => TRUE);