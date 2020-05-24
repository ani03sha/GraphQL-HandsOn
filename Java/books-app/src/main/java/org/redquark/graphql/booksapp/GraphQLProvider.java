package org.redquark.graphql.booksapp;

import com.google.common.base.Charsets;
import com.google.common.io.Resources;
import graphql.GraphQL;
import graphql.schema.GraphQLSchema;
import graphql.schema.idl.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.net.URL;

@Component
public class GraphQLProvider {

    @Autowired
    private GraphQLDataFetchers graphQLDataFetchers;

    private GraphQL graphQL;

    @Bean
    public GraphQL graphQL() {
        return graphQL;
    }

    @PostConstruct
    public void init() {
        try {
            // Reading out schema file from the resources
            URL url = Resources.getResource("schema.graphqls");
            String schemaDefinitionLanguage = Resources.toString(url, Charsets.UTF_8);
            GraphQLSchema graphQLSchema = buildSchema(schemaDefinitionLanguage);
            this.graphQL = GraphQL.newGraphQL(graphQLSchema).build();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * This method builds the schema for graphql and returns it
     *
     * @param schemaDefinitionLanguage - the string version of SDL
     * @return GraphQLSchema
     */
    private GraphQLSchema buildSchema(String schemaDefinitionLanguage) {
        // Parsed version of our schema file
        TypeDefinitionRegistry typeDefinitionRegistry = new SchemaParser().parse(schemaDefinitionLanguage);
        RuntimeWiring runtimeWiring = buildWiring();
        // This combines TypeDefinitionRegistry and RuntimeWiring to actually make the GraphQLSchema
        SchemaGenerator schemaGenerator = new SchemaGenerator();
        return schemaGenerator.makeExecutableSchema(typeDefinitionRegistry, runtimeWiring);
    }

    /**
     * This method registers two data fetchers
     * 1. One to retrieve a book with specific id
     * 2. One to get author of a specific book
     *
     * @return RuntimeWiring
     */
    private RuntimeWiring buildWiring() {
        return RuntimeWiring.newRuntimeWiring()
                .type(TypeRuntimeWiring.newTypeWiring("Query")
                        .dataFetcher("bookById", graphQLDataFetchers.getBookByIdDataFetcher()))
                .type(TypeRuntimeWiring.newTypeWiring("Book")
                        .dataFetcher("author", graphQLDataFetchers.getAuthorDataFetcher()))
                .build();
    }
}
