--animal export by herd
select
	av.critter_id,
	--av.critter_transaction_id,
	av.animal_id,
	--av.animal_status,
	--av.associated_animal_id,
	--av.associated_animal_relationship,
	av.capture_comment,
	av.capture_date,
	av.capture_latitude,
	av.capture_longitude,
	av.capture_utm_easting,
	av.capture_utm_northing,
	av.capture_utm_zone,
	av.collective_unit,
	av.animal_colouration,
	av.ear_tag_left_id,
	av.ear_tag_right_id,
	av.ear_tag_left_colour,
	av.ear_tag_right_colour,
	av.estimated_age,
	av.juvenile_at_heel,
	av.juvenile_at_heel_count,
	av.life_stage,
	--av.map_colour,
	av.mortality_comment,
	av.mortality_date,
	av.mortality_latitude,
	av.mortality_longitude,
	av.mortality_utm_easting,
	av.mortality_utm_northing,
	av.mortality_utm_zone,
	av.proximate_cause_of_death,
	av.ultimate_cause_of_death,
	av.population_unit,
	av.recapture,
	av.region,
	--av.release_comment,
	--av.release_date,
	--av.release_latitude,
	--av.release_longitude,
	--av.release_utm_easting,
	--av.release_utm_northing,
	--av.release_utm_zone,
	av.sex,
	av.species,
	--av.translocation,
	av.wlh_id,
	av.animal_comment,
	caav.attachment_start,
	caav.attachment_end,
	caav.collar_id,
	c.device_id, 
	c.device_make
	--av.pcod_predator_species,
	--av.ucod_predator_species,
	--av.predator_known,
	--av.captivity_status,
	--av.mortality_captivity_status,
	--av.pcod_confidence,
	--av.ucod_confidence,
	--av.mortality_report,
	--av.mortality_investigation
	--av.valid_from,
	--av.valid_to,
	--av.created_at,
	--av.created_by_user_id,
	--av.owned_by_user_id
from
	animal_v av
left join bctw_dapi_v1.collar_animal_assignment_v caav on
	av.critter_id = caav.critter_id
left join collar c on caav.collar_id = c.collar_id 
where
	is_valid(av.valid_to)
	and av.population_unit = 'Itcha-Ilgachuz'
	and av.species = 'Caribou'
group by 	av.critter_id,
	--av.critter_transaction_id,
	av.animal_id,
	--av.animal_status,
	--av.associated_animal_id,
	--av.associated_animal_relationship,
	av.capture_comment,
	av.capture_date,
	av.capture_latitude,
	av.capture_longitude,
	av.capture_utm_easting,
	av.capture_utm_northing,
	av.capture_utm_zone,
	av.collective_unit,
	av.animal_colouration,
	av.ear_tag_left_id,
	av.ear_tag_right_id,
	av.ear_tag_left_colour,
	av.ear_tag_right_colour,
	av.estimated_age,
	av.juvenile_at_heel,
	av.juvenile_at_heel_count,
	av.life_stage,
	--av.map_colour,
	av.mortality_comment,
	av.mortality_date,
	av.mortality_latitude,
	av.mortality_longitude,
	av.mortality_utm_easting,
	av.mortality_utm_northing,
	av.mortality_utm_zone,
	av.proximate_cause_of_death,
	av.ultimate_cause_of_death,
	av.population_unit,
	av.recapture,
	av.region,
	--av.release_comment,
	--av.release_date,
	--av.release_latitude,
	--av.release_longitude,
	--av.release_utm_easting,
	--av.release_utm_northing,
	--av.release_utm_zone,
	av.sex,
	av.species,
	--av.translocation,
	av.wlh_id,
	av.animal_comment,
	caav.attachment_start,
	caav.attachment_end,
	caav.collar_id,
	c.device_id,
	c.device_make

	
	

	
	
--collar subquery lotek
select
	*	
from
	lotek_collar_data lcd
where
	lcd.deviceid in (select
		c.device_id as deviceid
from
		animal_v av
left join bctw_dapi_v1.collar_animal_assignment_v caav on
		av.critter_id = caav.critter_id
left join collar c on
		caav.collar_id = c.collar_id
where
		is_valid(av.valid_to)
	and av.population_unit = 'Itcha-Ilgachuz'
	and av.species = 'Caribou'
	and c.device_make = '278')


--collar subquery vectronic
select
	*
from
	vectronics_collar_data vcd
where
	vcd.idcollar in(
	select
		c.device_id
	from
		animal_v av
	left join bctw_dapi_v1.collar_animal_assignment_v caav on
		av.critter_id = caav.critter_id
	left join collar c on
		caav.collar_id = c.collar_id
	where
		is_valid(av.valid_to)
			and av.population_unit = 'Itcha-Ilgachuz'
			and av.species = 'Caribou'
			and c.device_make = '281')







SELECT *
  FROM information_schema.columns
 WHERE table_schema = 'bctw'
   AND table_name   = 'animal_v'
     ;