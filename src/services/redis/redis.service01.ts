const { Graph } = require("redisgraph.js");

export async function runSocialGraphExample(graphName = "social") {
  const graph = new Graph(graphName);

  try {
    // Создание узлов
    await graph.query("CREATE (:person {name:'roi', age:32})");
    await graph.query("CREATE (:person {name:'amit', age:30})");

    // Создание ребра между roi и amit
    await graph.query(`
      MATCH (a:person {name:'roi'}), (b:person {name:'amit'})
      CREATE (a)-[:knows]->(b)
    `);

    // 1) Простой MATCH-запрос
    let result = await graph.query(`
      MATCH (a:person)-[:knows]->(:person)
      RETURN a.name AS name
    `);
    while (result.hasNext()) {
      console.log("Knows:", result.next().get("name"));
    }
    console.log("Execution time:", result.getStatistics().queryExecutionTime());

    // 2) MATCH с параметром
    const params = { age: 30 };
    result = await graph.query(
      "MATCH (a:person {age: $age}) RETURN a.name AS name",
      params,
    );
    while (result.hasNext()) {
      console.log("Age 30:", result.next().get("name"));
    }

    // 3) Named path
    result = await graph.query(
      "MATCH p=(a:person)-[:knows]->(:person) RETURN p",
    );
    while (result.hasNext()) {
      const path = result.next().get("p");
      console.log("Path node count:", path.nodeCount);
    }
  } finally {
    // Очистка и закрытие соединения
    // await graph.deleteGraph();
    graph.close();
  }
}
