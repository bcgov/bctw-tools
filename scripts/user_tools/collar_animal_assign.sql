-- used to join a critter to a collar on device id

insert
	into
	collar_animal_assignment (critter_id,
	collar_id,
	attachment_end,
	attachment_start,
	valid_from,
	valid_to)

select
		a.critter_id as critter_id,
		c.collar_id as collar_id,
		c.offline_date as attachment_end,
		a.capture_date as attachment_start,
		a.capture_date as valid_from,
		c.offline_date as valid_to
from
		animal a ,
		collar c
where
		(a.device_id = c.device_id
		and a.device_id = c.device_id
		and a.capture_date is not null
		and is_valid(c.valid_to)
		and is_valid(a.valid_to)
		and a.wlh_id in ());
