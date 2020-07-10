export default (req) => {
    console.log("handle...", req.url);
    req.respond({
        status: 200,
        body: `This is /api/test response!`
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0EsZUFBZSxDQUFDLEdBQWlCLEVBQUMsRUFBRTtJQUNsQyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDakMsR0FBRyxDQUFDLE9BQU8sQ0FBQztRQUNWLE1BQU0sRUFBQyxHQUFHO1FBQ1YsSUFBSSxFQUFDLDZCQUE2QjtLQUNuQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUEifQ==