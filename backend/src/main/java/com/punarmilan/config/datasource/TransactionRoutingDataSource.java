package com.punarmilan.config.datasource;

import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;

public class TransactionRoutingDataSource extends AbstractRoutingDataSource {
    @Override
    protected Object determineCurrentLookupKey() {
        return RoutingDataSourceContextHolder.getDataSourceType();
    }
}
