# Extract sementic roles about each entity
import sys
import json
import spacy

MODEL_NAME = 'en_core_web_sm'
nlp = spacy.load(MODEL_NAME);

# Load the spaCy model

def sem_roles(text) :
    # this kinds of code that deals with io must practically put insie try blocks.



    doc = nlp(str(text))

    named_entities = [ent.text for ent in doc.ents]

    semantic_roles = [(token.text, token.dep_, token.head.text) for token in doc]
    return semantic_roles




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
                res.append({'name':d_r['name'] ,'data' :item , 'feature' : sem_roles(item)});
            d_r['buffer'] = res;
            d_r['rawData'] = None;


            response_json = json.dumps(d_r)
            print(response_json)
        except json.JSONDecodeError as e:
            print(json.dumps(f"Error decoding JSON: {e}"));
    else:
        print(json.dumps('No data received in Python.'))
        pass;

if __name__ == "__main__" :
    main()
