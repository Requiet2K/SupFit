package com.project.supplement.task;

import com.project.supplement.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ScheduledTasks {

    private static final Logger log = LoggerFactory.getLogger(ScheduledTasks.class);
    private final ProductService productService;

    @Scheduled(cron = "0 0 0 * * ?") // runs every midnight
    public void reStock(){
        productService.reStock();
        log.info("Products successfully re-stocked!");
    }

}
