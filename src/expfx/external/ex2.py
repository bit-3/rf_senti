import sys
import json

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
            d_r['news'] = ' we change the news';



            # Process the data and send a response back to Node.js
            response_data = {'status': 'bert', 'data':d_r}
            #
            #
            # # Serialize the response data to JSON and print to stdout
            response_json = json.dumps(response_data)
            print(response_json)
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
    else:
        print('No data received in Python.')
        pass;



if __name__ == "__main__" :
    main();
