# SERVE THE BAG OF CONCEPTS FOR YOU
import spacy
import sys
import json

MODEL_NAME = 'en_core_web_sm'
# for efficiency : not load on every iteration
nlp = spacy.load(MODEL_NAME)


# main entry
def main() :
    #print('this is from python');
    if len(sys.argv) > 1:
        serialized_data = sys.argv[1]
        #print(serialized_data)
        try:
            # Deserialize the JSON data to a Python object
            #data_received = json.loads(serialized_data)
            #print(f'Received data in Python: {data_received}')

            #print(data_received);

            d_r = json.loads(serialized_data);


            res =[];
            for item in d_r['rawData']:
                res.append({'name':d_r['name'],'data' :item , 'feature' : boc(item)});
            d_r['buffer'] = res;
            d_r['rawData'] = None;


            response_json = json.dumps(d_r)
            print(response_json)
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
    else:
        print('No data received in Python.')
        pass;



# later it must comes from another module.
def boc(text) :

    # Load the spaCy model

    # Sample text
    # defensive programming..


    doc = nlp(str(text))

    # Extract named entities : things in the news
    named_entities = [ent.text for ent in doc.ents]

    # Extract noun phrases (you may also consider verbs, adjectives, etc.)
    noun_phrases = [chunk.text for chunk in doc.noun_chunks]

    # Tokenize the text to get individual words
    tokens = [token.text for token in doc]

    # Combine the extracted concepts into a bag of concepts
    bag_of_concepts = named_entities + noun_phrases + tokens

    # Remove duplicates (if needed)
    bag_of_concepts = list(set(bag_of_concepts))
    return bag_of_concepts;




if __name__ == "__main__" :
    main();

