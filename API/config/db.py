from sqlalchemy import create_engine, MetaData, text, delete, update

engine = create_engine("mysql+pymysql://root:@localhost:3306/bug_tracker")

meta_data = MetaData()

text = text

print("Connected to database", engine.connect())