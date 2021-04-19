const concatAggregations = (
    aggregations: Array<{
        enabled: boolean
        aggregation: () => any
    }>
) =>
    aggregations
        .map((aggregation) => (aggregation.enabled ? aggregation.aggregation() : null))
        .filter((aggregation) => aggregation !== null)

export default concatAggregations
