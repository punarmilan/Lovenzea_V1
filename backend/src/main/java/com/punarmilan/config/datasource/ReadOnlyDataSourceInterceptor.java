package com.punarmilan.config.datasource;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.core.PriorityOrdered;

@Aspect
@Component
@Order(PriorityOrdered.HIGHEST_PRECEDENCE)
@Slf4j
public class ReadOnlyDataSourceInterceptor {

    @Around("execution(* com.punarmilan.service..*.*(..))")
    public Object proceed(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
        try {
            org.aspectj.lang.reflect.MethodSignature signature = (org.aspectj.lang.reflect.MethodSignature) proceedingJoinPoint.getSignature();
            java.lang.reflect.Method method = signature.getMethod();
            
            Transactional transactional = method.getAnnotation(Transactional.class);
            if (transactional == null) {
                transactional = proceedingJoinPoint.getTarget().getClass().getAnnotation(Transactional.class);
            }

            if (transactional != null && transactional.readOnly()) {
                RoutingDataSourceContextHolder.setDataSourceType(DataSourceType.REPLICA);
                log.debug("Routing to REPLICA datasource for: {}", method.getName());
            } else {
                RoutingDataSourceContextHolder.setDataSourceType(DataSourceType.MASTER);
                log.debug("Routing to MASTER datasource for: {}", method.getName());
            }
            return proceedingJoinPoint.proceed();
        } finally {
            RoutingDataSourceContextHolder.clearDataSourceType();
        }
    }
}
